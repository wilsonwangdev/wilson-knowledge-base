---
title: "Effective Harnesses for Long-Running Agents"
date: 2026-03-08T09:00:00
tags: [agent-engineering, long-running-agents, context-management, claude-agent-sdk, anthropic]
aliases:
  - 阅读列表/2026年03月/effective-harnesses-long-running-agents
---

## 一句话总结

Anthropic 工程团队分享了让 Claude Agent SDK 跨越多个上下文窗口有效运行的方法——初始化智能体 + 编码智能体的双层架构，灵感来自高效人类工程师的工作习惯。

## 核心方案

1. **核心挑战**：每次新会话开始时没有任何此前工作的记忆，类似工程师换班但不知前任做了什么。即使使用 compaction 压缩技术，前沿模型也无法仅靠高层提示完成复杂项目。

2. **双层架构**：初始化智能体（initializer agent）负责搭建环境和功能列表，编码智能体（coding agent）负责每轮增量推进。

3. **功能清单策略**：初始化智能体生成超过 200 条功能需求并全部标记为「failing」，防止后续智能体过早认为任务完成。

4. **状态传递**：通过 `claude-progress.txt` 文件和 git 历史，智能体在新会话中能快速了解工作状态——借鉴高效工程师的笔记习惯。

5. **干净状态原则**：每轮会话结束时要求智能体将代码置于「干净状态」——无重大 bug、代码有序、文档完善——便于下一轮接手。

> "The key insight was finding a way for agents to quickly understand the state of work when starting with a fresh context window."

## 来源

[Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
