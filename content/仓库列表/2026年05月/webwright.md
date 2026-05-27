---
title: "Webwright — Microsoft 的极简浏览器 Agent"
date: 2026-05-26T16:00:00
tags: [tools, browser-agent, playwright, swe-bench, microsoft, code-as-action]
---

## 一句话总结

颠覆浏览器 Agent 范式：不是让 LLM 逐步操作浏览器，而是让它**写 Playwright 脚本**。~1.5k LoC 的极简架构，在长周期 Web 任务上击败重量级框架。

## 核心能力

- **Code-as-Action 范式**：Agent 生成可重运行的 Playwright 脚本，而非预测像素级点击
- **极简架构**：核心 agent loop 仅 ~450 行，总计 ~1.5k LoC
- **多后端支持**：OpenAI、Anthropic、OpenRouter
- **SOTA 成绩**：Online-Mind2Web 86.7%，Odysseys 长周期任务 60.1%（+15.6 pts）
- **插件生态**：Claude Code、Codex、OpenClaw、Hermes Agent 均已适配
- **工作区即状态**：每次任务产出可重跑 Python 脚本

## 技术栈

Python · MIT 协议 · 1.6K+ Stars · 微软官方项目

## 为什么关注

将"浏览器自动化"从 GUI 问题还原为**代码生成问题**——给 coding model 一个终端，让它写脚本、跑脚本、改脚本，比让 LLM 逐帧"看"浏览器屏幕高效得多。对 SWE-bench 类长周期任务，简洁 > 复杂再次被验证。

## 来源

[GitHub: microsoft/webwright](https://github.com/microsoft/webwright)
