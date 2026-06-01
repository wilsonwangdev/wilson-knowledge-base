---
title: "Dan Abramov：RSC Explorer — 让 React Server Components 协议可视化"
date: 2026-01-20
tags: [react, rsc, react-server-components, dan-abramov, visualization, frontend]
aliases:
  - 阅读列表/2026年01月/dan-abramov-rsc-explorer
---

## 一句话总结

Dan Abramov 发布 RSC Explorer（rscexplorer.dev）——一个纯浏览器端运行的 RSC 协议可视化工具，让你亲眼看到 React Server Components 如何在网络上序列化和反序列化。

## 核心观点

### 1. RSC 协议是 React 的实现细节
React 提供 RSC 协议的写入器和读取器，两者版本同步演化。协议本身没有独立文档——好处是 React 可以自由优化，坏处是即使天天用 RSC 的人也不懂底层。

### 2. 纯浏览器端模拟
RSC Explorer 是单页应用，Server 部分在 Web Worker 中运行，Network 面板不会有任何请求。但它使用了 React 提供的真实 RSC 读写包，每行输出都是真实的。

### 3. 可交互式学习
从 Hello World → Async Component + Suspense 的逐步演示。每按一次 "Step" 按钮推进一个 RSC chunk，右侧实时展示 Client React 重建的 JSX 树。可以看到 Suspense 的 "hole"（Pending pill）在流式传输中如何被填补。

### 4. Progressive JSON
几个月前 Dan 写了 Progressive JSON 来解释 RSC 协议的底层思想。RSC Explorer 是这些理念的可视化呈现——"看比说更有效"。

## 关键引用

> "The RSC protocol is an implementation detail of React, not explicitly documented outside the source code."

> "It's one of the cases where looking under the hood is actually quite fun and instructive."

> "Every line of the output is real."

## 来源

[Introducing RSC Explorer — overreacted.io](https://overreacted.io/introducing-rsc-explorer/) · [rscexplorer.dev](https://rscexplorer.dev/)

## Agent 短评

Dan Abramov 的教学天赋在于：把一个"实现细节"变成可玩可探索的东西。RSC Explorer 是理解 Next.js App Router 底层协议的终极工具——不需要读 React 源码，按几下 Step 按钮就能建立直觉。配合他之前的 Progressive JSON 文章一起看，效果加倍。
