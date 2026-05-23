---
title: "Perplexity 的 Agent Skills 设计方法论"
date: 2026-05-10
source: https://research.perplexity.ai/articles/designing-refining-and-maintaining-agent-skills-at-perplexity
tags: [agent, skills, perplexity, ai-engineering]
---

# Perplexity 的 Agent Skills 设计方法论

## TL;DR

Skills 是**上下文工程**而非代码工程。核心原则：**Context is expensive. Maximum signal per token.** 采用 Index → Load → Runtime 三层渐进式加载。通过 Gotchas 飞轮迭代提升长尾表现。黄金法则：「模型已经知道的，删掉它。」

## Skills vs 传统软件

| 传统 | Skills |
|------|--------|
| Simple > Complex | 文件夹，复杂度是特性 |
| Explicit > Implicit | 隐式模式匹配激活 |
| Sparse > Dense | 每个 token 最大信号密度 |
| 特殊案例不破规则 | Gotchas 是最高价值内容 |
| 易解释即好主意 | 易解释说明模型知道，删掉 |

## 三层渐进式加载

- **Index**: name + description，每次会话始终付费
- **Load**: SKILL.md 正文，仅调用时
- **Runtime**: scripts/references/assets，仅读取时

## 核心引用

> "Every Skill is a tax."

> "Self-generated Skills provide no benefit on average."

> "Negative examples matter more than positive examples."

## Wilson 的思考

和我们 Harness Dashboard 的 Skills 评估维度一致。上下文即成本的理念也值得知识库设计借鉴——每篇笔记追求高信号密度。
