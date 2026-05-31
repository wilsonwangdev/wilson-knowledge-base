---
title: "Pi Agent 原理与实现"
date: 2026-05-31T13:00:00
tags: [resource, agent, tutorial, pi, agent-loop, tool-calling, context-compression, session-management]
---

## 一句话总结

从零到一实现一个 AI Agent 的交互式教程——用工程化视角拆解 Pi 的核心思想，每一节回答「为什么需要这一层」，配合可运行的渐进式 Demo。

## 核心内容

- **最小 Agent 循环**：先建立最小心智模型，理解模型流和 Agent Loop 的本质
- **工具调用**：Function Calling 的完整实现链路
- **事件与状态**：Agent 运行时的事件系统和状态管理
- **JSONL 会话树**：用 JSONL 文件持久化会话，支持分支和回溯
- **资源加载与系统提示词**：动态装配 prompt 的机制
- **上下文压缩**：Token 预算管理和自动摘要
- **教学版项目**：React + Node + TypeScript 实现一个完整 Agent

## 为什么关注

市面上 Agent 教程大多教你「调 API」，这套教程教你「造引擎」——不翻译源码，而是先建立心智模型再逐层拆解，渐进式 Demo 可以直接改动运行。适合想理解 Agent 框架内部运作机制、或准备自己实现 Agent 系统的开发者。

## 来源

[Pi Agent 原理与实现](https://how-pi-agent-works.vercel.app/)
