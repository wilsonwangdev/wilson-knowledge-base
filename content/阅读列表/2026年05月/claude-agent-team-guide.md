---
title: "Building a Team of Claude Agents — 10 步搭建 Agent 团队"
date: 2026-05-26T10:00:00
tags: [claude, multi-agent, agent-team, anthropic, managed-agents, coordinator]
source: https://x.com/0xcodez/status/2058513716509913581
author: 0xCodez
---

## 一句话总结

从单 Agent 到 20 个并行 Agent 团队的实战指南，结合 Anthropic 官方文档、cookbook 和 Netflix / Spiral by Every 生产实践，三阶段十步：决策设计 → 搭建团队 → 运行观察改进。

## Agent 总结

### 第一阶段：决策与设计

1. **确认你真的需要团队** — 仅当任务可并行、需要专业化、或需要升级路由时才组队
2. **先画角色再写代码** — 设计一个协调者 + 若干专家，职责清晰无重叠
3. **按角色选模型** — 协调者用便宜快速的模型（如 Haiku），专家只在必要时用贵模型（如 Opus）

### 第二阶段：搭建团队

4. **设置 Managed Agents** — 使用 `managed-agents-2026-04-01` beta header
5. **自底向上创建专家** — 每个专家工具范围严格限定
6. **创建协调者** — 声明 `multiagent: type: coordinator`，roster 最多 20 个子 agent ID
7. **协调者 prompt 以管理者视角写** — 只写委派逻辑，不做领域工作

### 第三阶段：运行、观察、改进

8. **理解团队通信** — 每个子 agent 有独立上下文窗口/线程；协调者只能委派一层深
9. **在 Claude Console 中观察** — 完整 trace 显示委派决策和子 agent 推理
10. **扩展到 20 并添加共享记忆** — 使用 "Dreaming" 功能实现团队级知识积累

### 生产实践

- **Netflix 平台团队**：多 agent 编排处理数百个并发构建的日志
- 架构约束：仅一层委派（子 agent 不能再带团队）

### 五个常见错误

1. 不需要团队时硬组
2. 协调者自己动手干活
3. 工具范围不严格限定
4. 对抗 depth-1 限制（而非接受它）
5. 无 trace 盲跑

## 来源

原文：[@0xCodez on X](https://x.com/0xcodez/status/2058513716509913581)

## 关联阅读

- [[agent-harness-engineering|Agent Harness Engineering]]
- [[perplexity-agent-skills|Perplexity 的 Agent Skills 设计方法论]]
