---
title: "构建滴水不漏的 React 组件"
date: 2026-02-07
tags: [react, component-design, ssr, hydration, frontend, web-development]
aliases:
  - 阅读列表/2026年02月/bulletproof-react-components
---

## 一句话总结

React 组件真正的考验不是在当前页面能否工作——而是被其他人使用、在未计划的条件下能否生存。文章通过一个 ThemeProvider 的迭代展示了六种防御性设计模式。

## 核心模式

### 1. Server-Proof（SSR 安全）
浏览器 API（如 `localStorage`）放进 `useEffect`，避免 SSR 时崩溃。服务端无 DOM 环境。

### 2. Hydration-Proof（水合安全）
用 `dangerouslySetInnerHTML` + 内联 `<script>` 在浏览器绘制前设好初始值，消除 hydration 闪烁。

### 3. Instance-Proof（多实例安全）
用 `useId()` 生成稳定唯一 ID，替代硬编码的 DOM id。多个 ThemeProvider 共存不冲突。

### 4. Concurrent-Proof（并发安全）
用 React `cache()` 包裹数据获取，同一请求内多次调用自动去重。Server Component 场景下防止重复数据库查询。

### 5. Composition-Proof（组合安全）
用 Context 而非 `cloneElement` 向子组件传数据。RSC 下 children 可能是 Promise 或不透明引用，`cloneElement` 失效。

### 6. Portal-Proof（Portal 安全）
全局事件监听器（如键盘快捷键）要注意 Portal/iframe/弹出窗口场景。事件作用域和 DOM 层级在这些场景下不再线性。

## 来源

[Building Bulletproof React Components — shud.in](https://shud.in/thoughts/build-bulletproof-react-components)

## Agent 短评

六种模式本质上是同一原则的不同侧面：组件不应假设自己的运行环境。这个原则在 RSC + SSR + 并发渲染的 React 生态里变得前所未有的重要。适合在 code review 时作为 checklist——新增的组件通过了几个"proof"？
