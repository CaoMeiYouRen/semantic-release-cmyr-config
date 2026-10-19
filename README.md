<h1 align="center">semantic-release-cmyr-config </h1>
<p>
  <a href="https://www.npmjs.com/package/semantic-release-cmyr-config" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/semantic-release-cmyr-config.svg">
  </a>
  <a href="https://www.npmjs.com/package/semantic-release-cmyr-config" target="_blank">
    <img alt="npm downloads" src="https://img.shields.io/npm/dt/semantic-release-cmyr-config?label=npm%20downloads&color=yellow">
  </a>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/CaoMeiYouRen/semantic-release-cmyr-config.svg" />
  <a href="https://github.com/CaoMeiYouRen/semantic-release-cmyr-config/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/CaoMeiYouRen/semantic-release-cmyr-config/release.yml?branch=master">
  </a>
  <img src="https://img.shields.io/node/v/semantic-release-cmyr-config" />
  <a href="https://github.com/CaoMeiYouRen/semantic-release-cmyr-config#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/semantic-release-cmyr-config/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/semantic-release-cmyr-config/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/CaoMeiYouRen/semantic-release-cmyr-config?color=yellow" />
  </a>
</p>

> 草梅友仁自定义的 semantic-release 配置

## 🏠 主页

[https://github.com/CaoMeiYouRen/semantic-release-cmyr-config#readme](https://github.com/CaoMeiYouRen/semantic-release-cmyr-config#readme)

## 📦 环境要求

-   Node.js ^22.22.2 或 >=24.15
-   npm 或 pnpm 包管理器

## 插件

此共享配置使用以下插件：

-   [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer) - 分析提交消息以确定发布类型
-   [@semantic-release/release-notes-generator](https://github.com/semantic-release/release-notes-generator) - 生成发布说明
-   [@semantic-release/changelog](https://github.com/semantic-release/changelog) - 生成更新日志
-   [@semantic-release/npm](https://github.com/semantic-release/npm) - 发布到 npm
-   [@semantic-release/github](https://github.com/semantic-release/github) - 创建 GitHub 发布
-   [@semantic-release/git](https://github.com/semantic-release/git) - 提交更改到 Git 仓库

## 🚀 安装

```bash
npm install --save-dev semantic-release semantic-release-cmyr-config
```

## 👨‍💻 使用方法

可以在 [**semantic-release** 配置文件](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration)中配置此共享配置：

```json
{
    "extends": "semantic-release-cmyr-config"
}
```

## 配置说明

请查看每个插件的文档了解所需的安装和配置步骤。

### 默认配置

此包提供了一个默认的 semantic-release 配置，包含以下设置：

-   使用 `conventional-changelog-cmyr-config` 进行提交分析和发布说明生成
-   生成 `CHANGELOG.md` 文件
-   发布到 npm 注册表
-   创建 GitHub 发布
-   将更改提交回仓库

## 🛠️ 开发

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

## 👤 作者

**CaoMeiYouRen**

-   Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)

-   GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)

## 🤝 贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/semantic-release-cmyr-config/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/semantic-release-cmyr-config/blob/master/CONTRIBUTING.md).

## 💰 支持

如果觉得这个项目有用的话请给一颗 ⭐️，非常感谢

<a href="https://afdian.com/@CaoMeiYouRen">
  <img src="https://oss.cmyr.dev/images/202306192324870.png" width="312px" height="78px" alt="在爱发电支持我">
</a>

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CaoMeiYouRen/semantic-release-cmyr-config&type=Date)](https://star-history.com/#CaoMeiYouRen/semantic-release-cmyr-config&Date)

## 📝 License

Copyright © 2025 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [MIT](https://github.com/CaoMeiYouRen/semantic-release-cmyr-config/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
