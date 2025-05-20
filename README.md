# Electron + Vue3 + Electron Builder 示例项目

这是一个整合了 Electron、Vue3 和 Electron Builder 的示例项目，展示了如何构建和打包跨平台桌面应用。本项目可以作为 Electron + Vue3 开发的起点，包含了完整的开发、构建和打包流程。

## 项目特点

- 🎯 完整的 Electron + Vue3 + TypeScript 开发环境
- 📦 使用 Electron Builder 进行应用打包
- 🖥️ 跨平台支持 (Windows, macOS, Linux)
- 🔍 示例功能：本地文件系统浏览
- 📱 现代化的用户界面
- 🔒 内置安全策略
- 🚀 基于 Vue3 + TypeScript 开发

## 技术栈

- Electron - 跨平台桌面应用框架
- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - JavaScript 的超集
- Vite - 下一代前端构建工具
- Electron Builder - 应用打包工具

## 开发环境要求

- Node.js >= 16
- npm >= 7

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run electron:dev
```

### 构建应用

```bash
npm run electron:build
```

构建完成后，可以在 `dist_electron` 目录下找到打包好的应用。

## 项目结构

```
electron-vue3-demo/
├── electron/          # Electron 主进程代码
│   ├── main.cjs      # 主进程入口文件
│   └── preload.js    # 预加载脚本
├── src/              # 渲染进程代码
│   ├── types/        # TypeScript 类型定义
│   └── App.vue       # 主应用组件
├── dist_electron/    # 打包后的应用目录
└── package.json      # 项目配置文件
```

## 主要功能

1. 文件系统浏览
   - 浏览用户主目录
   - 显示文件和文件夹
   - 区分文件类型

2. 安全特性
   - 启用了上下文隔离 (Context Isolation)
   - 禁用了 Node.js 集成
   - 启用了沙箱模式
   - 配置了内容安全策略 (CSP)

3. 开发特性
   - 热重载支持
   - TypeScript 类型检查
   - 开发环境配置
   - 生产环境构建

## 学习要点

- Electron 主进程和渲染进程的通信
- Vue3 组件开发
- TypeScript 类型定义
- Electron Builder 打包配置
- 跨平台开发注意事项

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。
