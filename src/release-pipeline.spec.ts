import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const srRequire = createRequire(require.resolve('semantic-release/package.json'))

const resolvePlugin = (name: string): string => {
    try {
        return require.resolve(name)
    } catch {
        return srRequire.resolve(name)
    }
}

const loadPlugin = async (name: string) => {
    const mod = await import(resolvePlugin(name))
    return mod.default ?? mod
}

const repositoryUrl = 'https://github.com/CaoMeiYouRen/semantic-release-cmyr-config.git'
const packageName = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')).name
const baseContext = (commits: { hash: string, message: string }[]) => ({
    cwd: process.cwd(),
    env: process.env,
    options: { repositoryUrl },
    branch: { name: 'master' },
    commits,
    lastRelease: { version: '1.0.2', gitTag: 'v1.0.2', gitHead: '5c456e3' },
    nextRelease: { version: '1.1.0', type: 'minor', gitTag: 'v1.1.0', notes: '' },
    logger: { log: () => undefined, error: () => undefined },
})

describe('release 流程集成', () => {
    let config: { plugins: unknown[] }
    let analyzeCommits: (options: unknown, context: unknown) => Promise<string | null>
    let generateNotes: (options: unknown, context: unknown) => Promise<string>
    let changelogPrepare: (options: unknown, context: unknown) => Promise<void>

    beforeAll(async () => {
        const { default: loaded } = await import('./index')
        config = loaded
        const entries = config.plugins.map((plugin) => (Array.isArray(plugin) ? { name: plugin[0], options: plugin[1] } : { name: plugin as string, options: {} }))
        const analyzer = await loadPlugin(entries[0].name as string)
        const notes = await loadPlugin(entries[1].name as string)
        const changelog = await loadPlugin(entries[2].name as string)
        analyzeCommits = (options, context) => (analyzer.analyzeCommits ?? analyzer.default.analyzeCommits)(options, context)
        generateNotes = (options, context) => (notes.generateNotes ?? notes.default.generateNotes)(options, context)
        changelogPrepare = (options, context) => (changelog.prepare ?? changelog.default.prepare)(options, context)
    })

    const entries = () => config.plugins.map((plugin) => (Array.isArray(plugin) ? { name: plugin[0], options: plugin[1] } : { name: plugin as string, options: {} }))

    it('chore 不触发发布', async () => {
        const commits = [{ hash: 'aaa1111', message: 'chore(deps): bump katex to ^0.18.2' }]
        await expect(analyzeCommits(entries()[0].options, baseContext(commits))).resolves.toBeNull()
    })

    it('feat 触发 minor，BREAKING CHANGE 触发 major', async () => {
        const feat = [{ hash: 'aaa1111', message: 'feat: 新增能力' }]
        const breaking = [{ hash: 'bbb2222', message: 'feat: 重构\n\nBREAKING CHANGE: 配置项重命名' }]
        await expect(analyzeCommits(entries()[0].options, baseContext(feat))).resolves.toBe('minor')
        await expect(analyzeCommits(entries()[0].options, baseContext(breaking))).resolves.toBe('major')
    })

    it('生成的 release notes 使用中文分类与 commit 链接', async () => {
        const commits = [
            { hash: 'aaa1111', message: 'feat(deps): 升级依赖' },
            { hash: 'bbb2222', message: 'fix: 修复问题' },
            { hash: 'ccc3333', message: 'chore: 不进入日志' },
        ]
        const context = baseContext(commits)
        const notes = await generateNotes(entries()[1].options, context)

        expect(notes).toContain('### ✨ 新功能')
        expect(notes).toContain('### 🐛 Bug 修复')
        expect(notes).toContain('[aaa1111](https://github.com/CaoMeiYouRen/semantic-release-cmyr-config/commit/aaa1111)')
        expect(notes).not.toContain('不进入日志')
    })

    it('changelog 插件写入标题与 notes，并保留旧内容', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sr-cmyr-changelog-'))
        try {
            fs.writeFileSync(path.join(dir, 'CHANGELOG.md'), `# ${packageName}\n\n## 1.0.2\n\n旧内容\n`)
            const context = baseContext([{ hash: 'aaa1111', message: 'feat: 新功能' }])
            const options = entries()[2].options
            context.nextRelease.notes = await generateNotes(entries()[1].options, context)
            await changelogPrepare(options, { ...context, cwd: dir })

            const content = fs.readFileSync(path.join(dir, 'CHANGELOG.md'), 'utf8')
            expect(content.startsWith(`# ${packageName}\n\n# [1.1.0]`)).toBe(true)
            expect(content).toContain('### ✨ 新功能')
            expect(content).toContain('旧内容')
        } finally {
            fs.rmSync(dir, { recursive: true, force: true })
        }
    })
})
