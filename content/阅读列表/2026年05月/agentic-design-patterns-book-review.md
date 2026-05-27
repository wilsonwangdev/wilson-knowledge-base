---
title: "《Agentic Design Patterns》书评：重新理解 Agent 是什么"
date: 2026-05-26T11:00:00
tags: [agent, design-patterns, book-review, context-engineering, reflection, multi-agent]
source: https://x.com/yanhua1010/status/2058552177912947044
author: yanhua1010
---

## 一句话总结

Yanhua 对 Google 工程总监 Antonio Gullí 的《Agentic Design Patterns》（Springer 2025，453页，21 种设计模式）的深度导读。核心贡献：Agent 四个等级的分类法、Producer-Critic 反思模式、三层记忆模型，以及三条可立即落地的实战建议。

## 核心观点

### Agent 四个等级

| 等级 | 名称 | 特征 |
|------|------|------|
| Level 0 | 裸 LLM | 无工具、无记忆、无行动——"不是 Agent" |
| Level 1 | 工具使用者 | 自主判断何时调用工具（搜索、API、数据库） |
| Level 2 | 战略思考者 | 具备规划 + 上下文工程 + 自我反思 |
| Level 3 | 多 Agent 协作 | 项目经理/研究员/设计师协同，六种通信拓扑 |

### 关键洞察

**上下文工程四层模型**：系统提示词 → 外部数据 → 隐式数据 → 反馈回路

**Producer-Critic 反思模式**：双 Agent 用不同系统提示词迭代，直到 Critic 输出 `CODE_IS_PERFECT`

**记忆三层模型**：
- 会话层：单次对话上下文
- 状态层：跨会话的工作状态
- 持久层：长期知识积累

**变形多 Agent 系统**：目标驱动，Agent 自行判断何时创建/移除/重组团队

### 三条可立即落地的建议

1. **给现有 Agent 工作流加 Critic 层**（即插即用，成本最低的升级）
2. **从 Prompt Engineering 转向 Context Engineering**（把精力花在信息流设计而非 prompt 措辞）
3. **先把单 Agent 做到 Level 2，别急着上多 Agent**（多数场景根本不需要 Level 3）

## 来源

原文：[@yanhua1010 on X](https://x.com/yanhua1010/status/2058552177912947044)

## 关联阅读

- [[agent-harness-engineering|Agent Harness Engineering]]
- [[llm-engineering-three-paradigms|从 Prompt 到 Harness]]
