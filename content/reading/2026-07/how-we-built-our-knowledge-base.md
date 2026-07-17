---
title: "How We Built Our Knowledge Base"
date: 2026-07-06T22:00
tags: [knowledge-base, rag, embeddings, slack, enterprise, architecture]
aliases:
  - 阅读列表/2026年07月/how-we-built-our-knowledge-base
---

## 一句话总结

Cerebras 公开其内部知识库的完整架构——日处理 15,000+ 查询，覆盖芯片设计到云平台的全员使用，核心设计哲学是"不去迁移数据，去连接数据源"。

## 核心观点

**1. "Single source of truth"是妄想，连接优于迁移**

每季度都有人提议"把所有信息搬到同一个平台"，但实际信息产生在各自最顺手的地方——Slack 的讨论、Google Docs 的建议编辑、GitHub 的代码引用、Jira 的状态。Cerebras 的选择是不改变用户行为，而是在数据侧直接接入每个平台。

**2. 一张 embeddings 表打天下**

架构极其简洁：所有数据源 → LLM 蒸馏 → pgvector (3072-dim HNSW) → 同一张表。无论来自 Slack、Wiki、代码仓库还是硬件网表，最终都是同一 schema、同一查询接口。多源接入，单一数据面。

**3. 五层流水线**

Sources → Distillation (LLM 提取摘要) → Embeddings → Retrieval (6 路并行检索) → Fusion + Rerank (RRF k=60 → LLM 重排) → Synthesis (带引用的答案)。每层解耦，换模型不换架构。

**4. Slack 是最难也是最关键的数据源**

Slack 的工程讨论最及时也最非结构化。方案是 Socket Mode 实时监听 → 路由分流 → LLM 蒸馏成结构化摘要 → 向量化 → upsert 入库。只追踪指定频道和 @mention/DM，避免噪音。线程用 burst vector 方式处理，而非逐条消息。

**5. 同一接口服务三类用户：人、自动化、Agent**

查询接口通过 MCP + Web UI + Agent SDK 三层暴露，人类通过 Web 搜索、自动化脚本通过 API、Agent 通过 MCP 调用同一张 embeddings 表。设计上不区分消费者类型。

## 关键引用

> "Finding information inside an organization is hard. The data is scattered across tools, and every quarter or so someone proposes the same brilliant fix: let's record everything in one platform... The dream of a single source of truth, of course, rarely works in practice."

> "Every source, from Slack threads to netlists, lands in the same embeddings table, and anything in that table is immediately queryable through the same interface."

## 来源

- [Cerebras Blog: How We Built Our Knowledge Base](https://www.cerebras.ai/blog/how-we-built-our-knowledge-base)

## Agent 短评

这篇文章对你的知识库项目有直接参考价值，但要注意 Cerebras 的 KB 和你的 KB 解决的是不同层次的问题：Cerebras 做的是企业内搜——连接碎片化数据源、向量化、RAG 检索；你做的是人工策展——精选高质量内容、结构化笔记、发布为公开站点。前者追求覆盖面（多源自动摄入），后者追求深度（人工筛选+写作）。两者的交集在"连接"层：你的 KB 现在全靠手动添加，是否可以借鉴 Cerebras 的多源 connector 思路，让部分内容（如 RSS、Slack 讨论摘要）自动入库作为候选，再人工精选？
