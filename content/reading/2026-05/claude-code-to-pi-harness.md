---
title: "从 Claude Code 到 Pi：为什么 Agent Harness 比功能更重要"
date: 2026-05-26T15:00:00
tags: [agent, harness, claude-code, pi, coding-agent, context-ownership, minimalism]
source: https://x.com/nomad_maker/status/2058666489410929060
author: nomad_maker (Coralie)
aliases:
  - 阅读列表/2026年05月/claude-code-to-pi-harness
---

## 一句话总结

Coralie 讲述了从 Sublime→VS Code→Copilot→Cursor→Claude Code→Pi 的编码工具进化史。核心发现：**最好的 coding agent 可能不是功能最多的，而是给你最大自主权的**。Pi 用极简 harness 哲学证明：简单替代复杂，上下文所有权比内置功能更关键。

## Pi 是什么

Mario Zechner（@badlogicgames）打造的极简 **coding agent harness**：只给模型基本工具（读写编辑文件、运行命令），其余全由你定义。支持 15+ 模型提供商（Anthropic、OpenAI、Google、Azure、Mistral、Ollama、Groq）。作者推荐使用 OpenAI Codex 5.5。

## Pi vs Claude Code

| 维度 | Claude Code | Pi |
|------|------------|-----|
| 定位 | 精致、有主见的助手 | 一个你可以搭建自己工作流的工坊 |
| 规划 | 内置 Plan Mode | 手动维护 PLAN.md 文件 |
| 工具 | MCP 丰富的工具生态 | 默认不用 MCP，用 Bash + 小脚本 + README |
| 上下文 | 框架控制 | **你**控制模型看到什么 |
| 上手成本 | 低 | 高 |

## MCP 的反面意见

Zechner 的观点：**MCP 服务器暴露过多工具，不必要地消耗上下文**。Pi 默认不用 MCP——用 Bash、小脚本、README 文件替代。用户自己在项目内构建工具（如作者用 Pi 构建了 Blender 扩展作为项目本地工具）。

## 上下文所有权

> "In Pi, you control what the model sees. System prompts, tool definitions, and context assembly are transparent."

这正是 Harness Engineering 的 "Let go + guardrails" 理念的另一面——不仅放手给 agent，也放手给**用户**控制 agent 的边界。

## 来源

原文：[@nomad_maker on X](https://x.com/nomad_maker/status/2058666489410929060)

## Agent 短评

这篇文章和 poteto 的 Cursor 经历形成有趣的对照：两人都从 Claude Code 出发，一个选择了功能更全的 Cursor，一个选择了极简的 Pi。没有对错——关键是你要的是 assistant 还是 workshop。Coralie 对 MCP 的质疑也值得注意：工具多不代表好，上下文才是稀缺资源。
