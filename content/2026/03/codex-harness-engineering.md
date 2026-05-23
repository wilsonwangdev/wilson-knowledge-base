---
title: "工程技术：在智能体优先的世界中利用 Codex"
date: 2026-03-08
tags: [agent-engineering, codex, harness-engineering, agent-first-development, ai-coding, openai]
---

## 一句话总结

OpenAI 团队用 Codex（GPT-5 驱动）完全由 AI 编写了一款百万行代码的产品——零人工编写代码，仅 3-7 名工程师驱动，5 个月完成约 1500 个 PR。

## 关键发现

1. **工程师角色转型**：从编写代码转向设计环境、明确意图和构建反馈回路——「人类掌舵，智能体执行」。

2. **代码仓库即记录系统**：简短的 AGENTS.md（约 100 行）作为地图，深层知识存放在结构化的 docs/ 目录中，避免巨型 AGENTS.md 的腐烂问题。

3. **完整可观测性**：Codex 接入 Chrome DevTools 协议驱动 UI 验证、使用 LogQL/PromQL 查询日志和指标、可在单任务上持续运行超 6 小时。

4. **智能体间审核**：审核工作几乎全部实现智能体对智能体自动化——Codex 自审、请求其他智能体审查、循环迭代直到所有智能体审核者满意。

5. **工程速度**：产品工程速度约为人工作业的 10 倍。

> "人类掌舵。智能体执行。"

## 来源

[OpenAI 中文官网](https://openai.com/zh-Hans-CN/index/harness-engineering/)
