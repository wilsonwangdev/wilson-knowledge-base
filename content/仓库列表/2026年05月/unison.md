---
title: "Unison — 重新定义编程语言运行时"
date: 2026-05-26T18:00:00
tags: [tools, programming-language, functional, haskell, content-addressed, distributed-systems]
---

## 一句话总结

用内容寻址替代文件名——函数按实现的哈希标识，消除构建、合并冲突和脆弱的重命名。对编程语言运行时最激进的重构之一。

## 核心能力

- **内容寻址代码**：函数由实现哈希标识，非名称——重命名永不出错
- **零构建**：完美增量编译 + 共享编译缓存
- **语义版本控制**：不会因格式化/排序产生合并冲突
- **完美测试缓存**：只重跑依赖变更的测试
- **静态类型函数式语言**：类型推断 + effect 系统
- **工具链**：LSP、MCP（AI Agent Server）、Local UI
- **云原生**：集成 Unison Cloud 分布式系统

## 技术栈

Haskell · MIT 协议 · 6.6K+ Stars

## 为什么关注

对编程语言运行时的彻底重构——内容寻址消除了一整类开发痛点。之于函数式编程，如同 Smalltalk 之于 OOP。随着 AI Agent 成为编程入口，Unison 的内容寻址模型天然适合代码的语义化管理和复用。

## 来源

[GitHub: unisonweb/unison](https://github.com/unisonweb/unison)
