---
title: "Rendering as a Protocol — UI 应被描述而非被执行"
date: 2026-04-14T10:00:00
tags: [rendering, protocol, frontend, architecture]

aliases:
  - 阅读列表/2026年04月/rendering-as-protocol
---

## 一句话总结

CTR（Compile-Time Rendering）将渲染从运行时搬到编译期，用 JTD 契约 + Sentinel 哨兵 + Slot 标记实现零运行时开销的页面生成，告别水合错误且跨框架可用。

## 核心观点

**CTR（Compile-Time Rendering）**：把渲染从运行时搬到编译期，实现零运行时开销的页面生成。当前 SSR 的普遍问题：页面 95% 静态内容每请求都要完整跑 renderToString()。

## 方案：编译期渲染流水线

1. 数据与组件分离
2. JTD 契约（RFC 8927）跨语言映射
3. Sentinel 哨兵编译期 Mock 数据
4. Slot 标记转 HTML 注释 `<!--seam:user.name-->`
5. 运行时纯字符串替换，无需 JS 运行时

## 条件与循环

条件渲染用两次渲染 Diff 检测边界；列表生成 `<!--seam:each:-->`；模式匹配 `<!--seam:match:-->`。所有动态分支编译期穷举完毕。

## 附加收益

- 告别水合错误
- Serverless 友好（0.1-1ms vs SSR 100-300ms）
- 跨端可移植（协议语言无关）
- 前端框架无关（React/Vue/Svelte 均可）

## 来源

[Rendering as a Protocol — canmi.net](https://canmi.net/posts/architecture/compile-time-rendering)
