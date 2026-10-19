import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

const require = createRequire(import.meta.url)
const srRequire = createRequire(require.resolve('semantic-release/package.json'))

/** semantic-release 解析插件时优先从自身依赖解析，这里用同样的方式判断插件是否可加载。 */
const resolvePlugin = (name: string): string => {
    try {
        return require.resolve(name)
    } catch {
        return srRequire.resolve(name)
    }
}

const tempDirs: string[] = []
const makeTempCwd = (packageJson: unknown) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sr-cmyr-config-'))
    tempDirs.push(dir)
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(packageJson))
    return dir
}

/** 模块在顶层读取 package.json，因此每次都要重置模块缓存并切换进程 cwd。 */
const loadConfig = async (cwd: string) => {
    const previousCwd = process.cwd()
    process.chdir(cwd)
    try {
        vi.resetModules()
        const { default: config } = await import('./index')
        return config
    } finally {
        process.chdir(previousCwd)
    }
}

afterEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
    for (const dir of tempDirs.splice(0)) {
        fs.rmSync(dir, { recursive: true, force: true })
    }
})

describe('默认配置', () => {
    it('按固定顺序声明全部插件', async () => {
        const cwd = makeTempCwd({ name: 'demo-package' })
        const config = await loadConfig(cwd)

        expect(config.plugins.map((plugin) => (Array.isArray(plugin) ? plugin[0] : plugin))).toEqual([
            '@semantic-release/commit-analyzer',
            '@semantic-release/release-notes-generator',
            '@semantic-release/changelog',
            '@semantic-release/npm',
            '@semantic-release/github',
            '@semantic-release/git',
        ])
    })

    it('两个 changelog 生成器都使用 cmyr 预设', async () => {
        const cwd = makeTempCwd({ name: 'demo-package' })
        const config = await loadConfig(cwd)

        expect(config.plugins[0]).toEqual(['@semantic-release/commit-analyzer', { config: 'conventional-changelog-cmyr-config' }])
        expect(config.plugins[1]).toEqual(['@semantic-release/release-notes-generator', { config: 'conventional-changelog-cmyr-config' }])
    })

    it('CHANGELOG 标题取自当前项目的 package.json', async () => {
        const cwd = makeTempCwd({ name: 'demo-package' })
        const config = await loadConfig(cwd)
        const changelog = config.plugins[2]

        expect(Array.isArray(changelog)).toBe(true)
        expect((changelog as [string, { changelogFile: string, changelogTitle: string }])[1]).toEqual({
            changelogFile: 'CHANGELOG.md',
            changelogTitle: '# demo-package',
        })
    })

    it('git 插件只提交 CHANGELOG 与 package.json', async () => {
        const cwd = makeTempCwd({ name: 'demo-package' })
        const config = await loadConfig(cwd)

        expect(config.plugins[5]).toEqual(['@semantic-release/git', { assets: ['CHANGELOG.md', 'package.json'] }])
    })

    it.each([
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/npm',
        '@semantic-release/github',
        '@semantic-release/git',
        'conventional-changelog-cmyr-config',
    ])('插件 %s 可以被解析到', (name) => {
        expect(() => resolvePlugin(name)).not.toThrow()
    })
})
