import fs from 'fs'
const { name } = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
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
                changelogTitle: `# ${name}`,
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
