---
title: "pi 的设计艺术：构建生产级 Coding Agent 的架构决策"
date: 2026-04-11
tags: [agent, architecture, runtime, design]

aliases:
  - 阅读列表/2026年04月/pi-design-art
---

## 一句话总结

pi 是开源 agent 运行时（非 LLM 调用库），采用四层洋葱架构，内核仅 24% 代码量做三件事：调模型、跑循环、管状态，其余能力通过回调、接口和事件流外置。

## 定位

pi 是开源 **agent 运行时（runtime）**，非 LLM 调用库。调用库回答"怎么调 LLM"，pi 回答"调完之后怎么办"——工具执行、状态管理、上下文压缩、多轮循环。

## 洋葱架构（四层）

- **L1 pi-ai**：统一 20+ LLM provider 调用面
- **L2 pi-agent-core**：循环引擎，`agentLoop` 仅 ~1,859 行无状态纯函数
- **L3 pi-coding-agent**：产品内核，提供会话树、Compaction、Skill 机制
- **L4 产品壳**：CLI TUI / Slack Bot / Web UI，同一内核驱动三产品

## 核心哲学：极简核心，能力外置

内核仅占全仓库 24%，只做三件事：调模型、跑循环、管状态。Sub-agents、权限、Plan Mode 全部通过回调、接口和事件流外置。

## 反主流选择

明确**不内建**四个主流功能，均用底层机制组合替代：Sub-agents（嵌套 agentLoop）、MCP（不支持）、Permission Popup（beforeToolCall 钩子）、Plan Mode（transformContext 回调）。

## 协议式 vs 框架式

协议式设计（事件流+回调接口）让同一内核驱动三个不同产品，代价是上手成本更高。

## 工具设计原则

`edit` 用结构化编辑而非直接写文件，`read` 带行号与截断，`find`/`grep` 替代裸 bash——约束即保护。

## 来源

[pi 的设计艺术 — zhanghandong.github.io](https://zhanghandong.github.io/pi-book/)
