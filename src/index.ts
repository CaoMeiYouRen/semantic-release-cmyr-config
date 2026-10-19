import fs from 'node:fs'
import path from 'node:path'
import type { Options } from 'semantic-release'

/**
 * 读取指定目录下 package.json 的 name。
 * 目录不存在、文件损坏或缺少 name 时返回空字符串，不抛异常。
 */
export function readPackageName(cwd: string = process.cwd()): string {
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'))
        return typeof packageJson.name === 'string' ? packageJson.name : ''
    } catch {
        return ''
    }
}

/**
 * 创建默认配置。
 * 需要从非 process.cwd() 的目录读取包名时，可显式传入：
 * `createConfig(readPackageName('/path/to/project'))`
 */
export function createConfig(name: string = ''): Options {
    return {
        plugins: [
            [
                '@semantic-release/commit-analyzer',
                {
                    config: 'conventional-changelog-cmyr-config',
                },
            ],
            [
                '@semantic-release/release-notes-generator',
                {
                    config: 'conventional-changelog-cmyr-config',
                },
            ],
            [
                '@semantic-release/changelog',
                {
                    changelogFile: 'CHANGELOG.md',
                    changelogTitle: name ? `# ${name}` : '',
                },
            ],
            '@semantic-release/npm',
            '@semantic-release/github',
            [
                '@semantic-release/git',
                {
                    assets: [
                        'CHANGELOG.md',
                        'package.json',
                    ],
                },
            ],
        ],
    }
}

export default createConfig(readPackageName())
