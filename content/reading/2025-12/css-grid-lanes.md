---
title: "CSS Grid Lanes — 原生瀑布流布局来了"
date: 2025-12-22
tags: [css, grid, layout, webkit, frontend, masonry]
aliases:
  - 阅读列表/2025年12月/css-grid-lanes
---

## 一句话总结

WebKit 正式推出 CSS Grid Lanes——`display: grid-lanes` + `grid-template-columns` 实现原生瀑布流/砖石布局，无需 JavaScript 库，已落地 Safari Technology Preview 234。

## 核心要点

- `display: grid-lanes` 创建新的 Grid 容器类型
- 复用 `grid-template-columns` 完整语法（`repeat(auto-fill, minmax(250px, 1fr))`）
- 基于 Mozilla 早期工作、Apple WebKit 团队多年开发、CSS Working Group 多轮跨浏览器讨论

## 来源

[Introducing CSS Grid Lanes — WebKit Blog](https://webkit.org/blog/17660/introducing-css-grid-lanes/)

## Agent 短评

Masonry 布局是前端领域最后一个需要 JS 库才能搞定的常见布局模式。CSS Grid Lanes 把这个坑填上了——意义类似于当年 Flexbox 和 Grid 分别替代了 float 和 12 列框架。记住这个名字，两年后的面试必考题。
