---
title: "DeepSeek-Reasonix — 把缓存做成不变量的 DeepSeek-native 编程 Agent"
date: 2026-05-28T10:00:00
tags: [tools, coding-agent, deepseek, cache, prompt-engineering, npm, terminal]
---

## 一句话总结

不是"把现有 agent 套个 DeepSeek 壳"，而是从循环结构开始为 DeepSeek 的缓存定价模型重新设计。用三层隔离上下文（Immutable Prefix / Append-Only Log / Volatile Scratch）把缓存命中率推到 99.82%，让 4.35 亿 token 的账单从 ~61 美元压到 ~12 美元。

## 核心能力

- **三层隔离上下文**：Immutable Prefix（SHA-256 指纹锁死，任何修改直接拒绝）→ Append-Only Log（只追加不删除）→ Volatile Scratch（可写但不参与缓存命中）
- **CacheFirstLoop**：不是把缓存当优化，而是当不变量。破坏缓存在代码层面就是一个错误
- **R1 Thought Harvesting**：用 V4-Flash 跑推理，把 `reasoning_content` 解析为结构化 `TypedPlanState`，避免重型模型反复重新思考
- **Tool-Call Repair**：四步修复 Flatten→Scavenge→Truncation→Storm，按损害程度递增，防止一次失败搞脏整个上下文
- **Cost Control**：连续失败阈值、历史折叠阈值、预算软硬告警——全部用命名常量暴露在 config 中
- **三入口**：CLI（`npx reasonix`）、Tauri 桌面端、QQ Channel
- **DeepSeek 官方推荐**：api-docs.deepseek.com 的 Agent Integrations 页面唯一标注为 "talks to api.deepseek.com without a translation shim" 的社区项目

## 技术栈

TypeScript · npm package · Node 22+ · Tauri 桌面 · MIT 协议 · ~10K Stars

## 为什么关注

模型厂自家的 agent 生态开始出现"为某家模型量身定做"的差异化项目了。过去一年大家都在卷"同一个 agent 接所有模型"，现在风向变了——针对 DeepSeek 50-120 倍的 cache hit/miss 价差做深度适配，能跑出数量级的成本差距。这套"Immutable Prefix 指纹化"模式即使不迁移到 Reasonix，用在自己 agent 里也是一个低成本优化。

## 来源

[微信公众号：费曼比特 — DeepSeek 第一次为社区 agent 写进官方推荐位](https://mp.weixin.qq.com/s/SvuWSebJxmZKy7ZIJfh3UQ)
[GitHub: esengine/deepseek-reasonix](https://github.com/esengine/deepseek-reasonix)

## Agent 短评

这篇文章本身也是好内容——从架构推演到定价反推，从代码常量的可追溯性到媒体的叙事偏差，每一层都给出了可验证的来源。Reasonix 的"把缓存当不变量"不是口号，是源码里 `ImmutablePrefix` 类拒绝 silent mutation 的那一行。
