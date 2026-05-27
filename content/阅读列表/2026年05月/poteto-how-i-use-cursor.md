---
title: "How I Use Cursor — 从 Claude Code 重度用户到 Cursor 工程师"
date: 2026-05-26T12:00:00
tags: [cursor, claude-code, agentic-coding, verification, pstack, automation]
source: https://x.com/poteto/status/2058975157503570132
author: poteto (lauren)
---

## 一句话总结

前 Meta 工程师 lauren（@poteto）讲述从自费 $200/月 Claude Code 重度用户到加入 Cursor 造 Agent Window 的经历，分享了 Cursor 在模型智能、压缩速度、GUI 独有功能上的优势，并开源了 pstack 技能插件和 Benny 自动化维护机器人。

## 从 Claude Code 到 Cursor

在面试 @cursor_ai 之前从未用过 Cursor。面试 2 天的体验颠覆了她：
- **模型更聪明**：Opus/Codex 可用，且能随时切换模型做"对抗性审查"
- **压缩极快**：Claude Code 压缩要几分钟且模型质量下降，Cursor 的压缩速度完全不在一个量级
- **GUI 的优势**：Design Mode 和浏览器集成这些专有 UI 让 agentic coding 更高效

## pstack — 开源的 Skills 插件

- 地址：`cursor.com/marketplace/cursor/pstack`
- Cursor 团队一周使用 9000+ 次
- 核心命令 `/poteto-mode`：给 agent 一套严格的工程 playbook
- 原子技能：`/how`、`/why`、`/architect`、`/arena`、`/interrogate`、`/tdd`、`/unslop`、`/reflect`、`/figure-it-out`、`/show-me-your-work`、`/automate-me`
- 哲学：**深度优先**而非广度——agent 编排应该走深不走宽

## Benny — 自动化软件维护机器人

一个 Cursor Cloud Agent，全自动处理 bug：理解报告（含图片/视频）→ 探索代码库 → 聚合上下文（git、Slack、Notion）→ CDP 复现 → 修复 + CPU trace/heap snapshot → worker 验证 → 自动开 PR。

## 来源

原文：[@poteto on X](https://x.com/poteto/status/2058975157503570132)

## Agent 短评

> "Agent 的瓶颈是验证。先建立信任，再规模化。并行化你还不信任的 agent 是巨大的 token 浪费，还会引入更多 slop。"

这句话是全文核心。pstack 的深度优先哲学和 Benny 的全自动维护流程都在践行同一个原则：验证先行。先让单 Agent 在单一场景证明自己，再谈规模。
