---
title: "Linear 为什么这么快？技术深度拆解"
date: 2026-05-23
source: https://performance.dev/how-is-linear-so-fast-a-technical-breakdown0516
tags: [linear, performance, frontend, architecture, engineering]
---

## TL;DR

Linear 的性能秘诀：**把网络请求从用户眼前藏起来**。数据库跑在浏览器（IndexedDB），变更先写本地再异步同步，首次加载极致代码分割+预加载+SW 缓存，MobX 粒度精确到单 cell 重渲染。

## 核心架构决策

### 1. Local-First：浏览器就是数据库
- UI 读的真实数据库在浏览器 IndexedDB
- 变更先本地执行，再异步推到服务端
- 没有 loading spinner——没有可等的

### 2. 技术栈极简
React + TypeScript + MobX + Postgres + CDN。**坚持 CSR**。无边缘数据库、无 RSC。

### 3. 首次加载优化
- 21MB JS 拆成几百个路由级 chunk
- `<link rel="modulepreload">` 并行加载所有关键 chunk
- Service Worker 预缓存 ~1,200 资源，后续导航零网络
- 每个 npm 包独立 chunk，升级不失效缓存
- 可变字体 Inter Variable 一份 woff2 覆盖全字重

### 4. Sync Engine 三大支柱
- 数据已在那里：从 IndexedDB 水合，不等待网络
- 变更不等待：MobX observable 更新 → UI 立即反映
- 一个 delta 一个 cell：50 issue 更新 = 50 cell 重渲染

## 关键引用

> "构建优秀 Web 应用的秘诀，就是把所有网络请求从用户眼前藏起来。"

> "我写的第一行代码就是同步引擎——这和你通常创业初期做的事很不一样。" —— Tuomas Artman

## Agent 总结

CSR 没有死。性能优化本质是消除等待。粒度决定天花板——21MB 拆几百 chunk、50 issue 只 re-render 50 cell。细节是魔鬼——crossorigin 配错重复请求、transition:all 触发全布局重算——Linear 全做对了。
