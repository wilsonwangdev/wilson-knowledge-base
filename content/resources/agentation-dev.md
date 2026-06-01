---
title: "Agentation — Agent UI 可视化反馈工具"
date: 2026-01-26
tags: [resource, ai-agents, agent-development, ui-feedback, mcp]
---

## 一句话总结

Agentation 是一个将 UI 标注转化为结构化上下文的工具——在网页上点击任意元素添加注释，然后将输出粘贴给 Claude Code、Codex 等 AI 编程工具，让 Agent 精确理解「改这里」。

## 为什么关注

Agent 编程的最大痛点之一是「Agent 看不懂界面」——你让它「把那个按钮改大一点」，它需要猜测是哪个按钮。Agentation 用一个浏览器 overlay 解决了这个问题：点击元素 → 添加自然语言标注 → 生成结构化 JSON（AFS 1.1 Schema）→ 喂给 Agent。它还支持 MCP 协议集成和 Webhook，可以直接嵌入 CI/CD 流程。

`npm install agentation` 一行安装，桌面端使用。

## 来源

[agentation.dev](https://agentation.dev/) · [GitHub](https://github.com/benjitaylor/agentation)
