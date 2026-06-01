---
title: "Radash — 现代 TypeScript 工具库"
date: 2026-01-01
tags: [resource, javascript, utility, lodash, typescript, functional-programming]
---

## 一句话总结

Lodash 的现代替代品——TypeScript 优先、完全 tree-shakeable、函数式风格的工具库，每个函数都可以独立导入。

## 为什么关注

Lodash 虽然经典，但有两个致命问题：(1) 类型定义是后加的外挂，不是一等公民；(2) tree-shaking 效果不佳，即使只用一个函数也要引入大量代码。Radash 从设计之初就是 TypeScript 原生、每个函数独立文件、支持 `import { tryit } from 'radash'` 只打包用到的部分。

它保留了 Lodash 的核心精神（函数式工具集），但去掉了历史包袱。对于 2026 年的 TypeScript 项目，Radash 是比 Lodash 更好的默认选择。

## 来源

[radash-docs.vercel.app](https://radash-docs.vercel.app/) · [GitHub](https://github.com/rayepps/radash)
