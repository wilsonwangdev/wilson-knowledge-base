---
title: "RSC Explorer — React Server Components 协议可视化工具"
date: 2026-01-20T08:00:00
tags: [resource, react, rsc, visualization, debugging, dan-abramov]
---

## 一句话总结

Dan Abramov 打造的 React Server Components 协议可视化工具，纯浏览器端运行，逐步展示 RSC 数据如何在网络上序列化和反序列化。

## 为什么关注

理解 RSC 协议的最佳方式不是读 React 源码——是看它实际怎么跑。RSC Explorer 把 RSC chunk 的每一步传输都做成可暂停、可回退、可重放的演示：从 Hello World 到 Async Component + Suspense，每按一次 "Step" 按钮推进一个 chunk，右侧实时显示 Client React 重建的 JSX 树。

对 Next.js App Router 开发者来说是底层协议理解的神器——搞清楚 `"$L1"`、`"$L2"` 这些神秘标记到底是什么。

## 来源

[rscexplorer.dev](https://rscexplorer.dev/) · [Introducing RSC Explorer — overreacted.io](https://overreacted.io/introducing-rsc-explorer/)
