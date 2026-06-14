---
title: "Build your own React — 从零实现 React 的交互式教程"
date: 2026-06-09T18:00:00
tags: [resource, react, frontend, tutorial, fiber, hooks, reconciliation]
---

## 一句话总结

Rodrigo Pombo（CodeSandbox 作者）编写的交互式教程，从 `createElement` 到 Hooks 逐步实现一个迷你 React，左栏代码右栏实时运行，基于 React 16.8 真实架构但剥离了优化和非核心特性。

## 为什么关注

这不是又一个 React 原理解析文章——是让你亲手写出一个能跑的 React。八个步骤覆盖 `createElement` → `render` → Concurrent Mode（`requestIdleCallback`）→ Fiber 链表 → Render/Commit 两阶段分离 → Reconciliation diff → 函数组件 → `useState`，每一步都在浏览器里实时验证结果。

对理解 React 内部机制（为什么需要 Fiber、为什么 Render 可中断而 Commit 不可中断、`useState` 状态存在哪里）而言，没有比「自己写一遍」更好的路径。也是面试 React 原理题的最佳预习材料。

## 来源

[Build your own React — pomb.us](https://pomb.us/build-your-own-react/)
