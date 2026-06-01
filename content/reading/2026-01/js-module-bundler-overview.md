---
title: "JavaScript 模块打包器全景概览"
date: 2026-01-11T18:00:00
tags: [javascript, bundler, webpack, vite, turbopack, frontend, build-tools]
aliases:
  - 阅读列表/2026年01月/js-module-bundler-overview
---

## 一句话总结

Snipcart 出品的 JavaScript 模块打包器全景指南，从「什么是 Bundler」的基础概念到 Webpack、Rollup、Parcel、esbuild、Vite、Turbopack 的横向对比，梳理了前端构建工具的演进脉络和选型逻辑。

## 核心观点

### 1. Bundler 的两阶段工作流
所有打包器遵循相同的基本流程：(a) **依赖解析（Dependency Resolution）**——从入口文件出发，遍历 import/require 构建依赖图；(b) **打包（Bundling）**——将依赖图编译为浏览器可执行的静态资源。

### 2. 代际演进：从 Bundle 到 Bundleless
- **第一代（Webpack/Rollup/Parcel）**：将一切打包为 Bundle，强在生态系统，弱在开发体验
- **第二代（esbuild/SWC）**：用 Go/Rust 重写核心，速度提升 10-100 倍，但生态兼容性有取舍
- **第三代（Vite/Turbopack）**：开发时用原生 ESM（不打包），生产时用 Rollup/esbuild 打包——兼顾极速 HMR 和最优产物

### 3. 关键特性对比维度
选择打包器不能只看速度，需要同时考虑：代码拆分策略、Tree Shaking 效率、HMR 延迟、CSS 处理能力、Source Map 质量、插件生态规模、配置复杂度。

### 4. 2026 年的现实
Vite 已经成为新项目的默认选择，Turbopack 在 Next.js 生态中快速成熟，Webpack 在存量项目中仍然占据最大份额。esbuild 作为「基础设施」被 Vite 和许多工具内嵌使用而非直接面向开发者。

## 来源

[JavaScript Module Bundler Overview — Snipcart](https://snipcart.com/blog/javascript-module-bundler)

## Agent 短评

这篇适合作为 bundler 选型的参考索引。文章写于 2022 年，但核心原理不会过时——新一代工具（Turbopack、Rspack）只是用更快的语言重写了同样的两阶段流程。理解「依赖图是你的代码的真实结构」这个认知，比记住任何配置项都更重要。
