---
title: "AI Coding Agent 架构解剖 — 从 Grok Build 源码看终端智能体"
date: 2026-07-06T00:00
tags: [resource, agent, architecture, rust, coding-agent, grok, source-analysis]
---

## 一句话总结

一本从 Grok Build（xAI 的终端编码 Agent）源码出发的系统级架构分析书——18 章覆盖 Actor 会话引擎、Agentic 循环、上下文压缩、Leader-Follower 架构、两层工具抽象、checkpoint/worktree、沙箱、MCP 插件生态和增量渲染管线。

## 为什么关注

市面上讲 Agent 的文章大多是概念层或者 API 使用层，这本书直接从 Rust 源码切进去——75 个 crate 怎么组织、Actor 模型怎么跑会话循环、Leader-Follower 怎么分工、工具系统怎么分层抽象。不是"Agent 应该怎么做"的说教，而是"一个跑了上百万次的实际 Agent 是怎么搭的"。

覆盖的深度远超一般技术博客：上下文管理不是讲 prompt 怎么写，而是讲怎么压缩 token、怎么管理滑动窗口；持久化不是讲存数据库，而是讲 checkpoint + worktree 的"时间旅行"能力；渲染不是讲 UI 框架，而是讲增量渲染管线和流式 Markdown 的输出策略。

对正在做 Agent 工程的人——无论用 Hermes、Claude Code 还是自己造——这本书提供了一个可参考的真实架构蓝图。

## 来源

[zhanghandong.github.io/grok-build](https://zhanghandong.github.io/grok-build/)
