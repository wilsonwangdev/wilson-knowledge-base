---
title: "The Vertical Codebase（垂直代码库）"
date: 2026-04-16
tags: [architecture, code-organization, software-design]

---

## 一句话总结

垂直代码库按功能领域而非技术类型组织代码，让一起变更的代码放在一起，Monorepo + eslint-plugin-boundaries 强制边界约束。AI 时代基础工程实践变得更重要。

## 核心概念

**水平结构**：按技术类型分（components/hooks/types/utils），分组的是"是什么"。
**垂直结构**：按功能领域分，同一业务域的组件+hooks+类型+工具放在一起，分组的是"做什么"。

Sentry 的 `components/` 十年积累了 200+ 文件，唯一共性是"都是组件"。

## 关键原则

- 一起变更的代码放在一起
- 低耦合高内聚——水平结构恰恰创造反面
- 共享代码自成垂直（设计系统等）
- 每个垂直有公开接口，Monorepo + eslint-plugin-boundaries 强制约束

## AI 时代

AI Agent 和人类一样需要清晰边界和快速反馈。新项目 Agent 表现好恰因结构清晰；混乱老项目对 Agent 同样低效。**基础工程实践在 AI 时代更重要。**

## 来源

[The Vertical Codebase — tkdodo.eu](https://tkdodo.eu/blog/the-vertical-codebase)
