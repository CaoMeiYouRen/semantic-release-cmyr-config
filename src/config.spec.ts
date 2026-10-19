import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createConfig, readPackageName } from './index'

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
const makeTempDir = (packageJson?: string) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sr-cmyr-config-'))
    tempDirs.push(dir)
    if (packageJson !== undefined) {
        fs.writeFileSync(path.join(dir, 'package.json'), packageJson)
    }
    return dir
}

afterEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
    for (const dir of tempDirs.splice(0)) {
        fs.rmSync(dir, { recursive: true, force: true })
    }
})

describe('createConfig', () => {
    it('按固定顺序声明全部插件', () => {
        const config = createConfig('demo-package')

        expect(config.plugins?.map((plugin) => (Array.isArray(plugin) ? plugin[0] : plugin))).toEqual([
            '@semantic-release/commit-analyzer',
            '@semantic-release/release-notes-generator',
            '@semantic-release/changelog',
            '@semantic-release/npm',
            '@semantic-release/github',
            '@semantic-release/git',
        ])
    })

    it('两个 changelog 生成器都使用 cmyr 预设', () => {
        const config = createConfig('demo-package')

        expect(config.plugins?.[0]).toEqual(['@semantic-release/commit-analyzer', { config: 'conventional-changelog-cmyr-config' }])
        expect(config.plugins?.[1]).toEqual(['@semantic-release/release-notes-generator', { config: 'conventional-changelog-cmyr-config' }])
    })

    it('CHANGELOG 标题取自传入的项目名', () => {
        const config = createConfig('demo-package')

        expect(config.plugins?.[2]).toEqual([
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
                changelogTitle: '# demo-package',
            },
        ])
    })

    it('项目名为空时标题为空字符串，不会写出 # undefined', () => {
        const config = createConfig()

        expect(config.plugins?.[2]).toEqual([
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
                changelogTitle: '',
            },
        ])
    })

    it('git 插件只提交 CHANGELOG 与 package.json', () => {
        const config = createConfig('demo-package')

        expect(config.plugins?.[5]).toEqual(['@semantic-release/git', { assets: ['CHANGELOG.md', 'package.json'] }])
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

describe('readPackageName', () => {
    it('读取指定目录的 package.json name', () => {
        const dir = makeTempDir(JSON.stringify({ name: 'demo-package' }))

        expect(readPackageName(dir)).toBe('demo-package')
    })

    it('目录下没有 package.json 时返回空字符串', () => {
        expect(readPackageName(makeTempDir())).toBe('')
    })

    it('package.json 损坏时返回空字符串', () => {
        expect(readPackageName(makeTempDir('{oops'))).toBe('')
    })

    it('缺少 name 时返回空字符串', () => {
        expect(readPackageName(makeTempDir(JSON.stringify({ version: '1.0.0' })))).toBe('')
    })

    it('默认导出使用当前工作目录的 package.json', async () => {
        const dir = makeTempDir(JSON.stringify({ name: 'cwd-package' }))
        const previousCwd = process.cwd()
        process.chdir(dir)
        try {
            vi.resetModules()
            const { default: config } = await import('./index')
            expect(config.plugins?.[2]).toEqual([
                '@semantic-release/changelog',
                {
                    changelogFile: 'CHANGELOG.md',
                    changelogTitle: '# cwd-package',
                },
            ])
        } finally {
            process.chdir(previousCwd)
        }
    })
})
