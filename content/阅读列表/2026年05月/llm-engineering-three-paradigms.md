---
title: "从 Prompt 到 Harness：LLM Engineering 的三次范式跃迁"
date: 2026-05-26T09:00:00
tags: [llm-engineering, harness, prompt-engineering, context-engineering, agent, paradigm-shift]
source: https://x.com/yan5xu/status/2059117572826746979
author: yan5xu
---

## 一句话总结

LLM Engineering 正经历三个阶段：Prompt Engineering（静态单步）→ Context Engineering（程序化多步信息流）→ Harness Engineering（放手 + 护栏），每一层不消失，而是成为下一层的基础设施。作者用 Stripe、Anthropic、OpenAI Codex 三个案例验证了这一框架。

## 核心观点

### 三个阶段的核心特征

**Phase 1: Prompt Engineering — "对着🔮许愿的时代"**
- 静态单步任务，人手动调优 prompt
- 限制：无法处理多步骤任务

**Phase 2: Context Engineering — 程序化信息流管理**
- 动态多步任务，程序按预设规则管理步骤间的信息流
- Cursor、Lovable、Bolt 为此类代表
- Karpathy 2025 年定义："Context engineering is the delicate art and science of filling the context window with just the right information for the next step"
- 限制：人硬编码的规则限制了模型自主性上限

**Phase 3: Harness Engineering — 放手 + 护栏**
- 两步法：(a) **Let go** — 给 agent 工具自主获取反馈（lint、tests、代码搜索、浏览器状态）；(b) **Add guardrails** — 定义能力边界防失控（沙盒、CI 轮次限制、文件权限、架构约束）

### 三个真实案例

1. **Stripe Minions**：每周 1000+ agent 代写 PR，人类只 review。核心理念："Shift feedback left"——5 秒本地 lint 检查
2. **Anthropic Claude Agent SDK**：克隆 claude.ai 过程中发现三种失败模式（一次做太多、过早完成、伪造测试），针对性加护栏
3. **OpenAI Codex Team**：3-7 人团队，5 个月，1M 行代码，1500 个 PR。关键引用："Agents aren't hard; the Harness is hard"

### 定量验证

- Epsilla 实验：仅改 harness 配置，任务成功率从 **42% → 78%**
- LangChain Terminal Bench 2.0：同一模型在不同 harness 下，解决率差异超过 **60%**

### 演进驱动力

螺旋式上升：模型变强 → 人敢于委托更多 → 新可靠性问题浮现 → 新工程实践出现。每个阶段不消失，而是沉淀为下一层的基础设施。

### 下一前沿

**Eval**（如何评判 agent 输出质量）和 **Governance**（多 agent 认证、审计、权限控制）。

## 来源

原文：[@yan5xu on X](https://x.com/yan5xu/status/2059117572826746979)

## 关联阅读

- [[agent-harness-engineering|Agent Harness Engineering]]
- [[long-task-agent-engineering-loop|长任务 Agent 的最小工程闭环]]
