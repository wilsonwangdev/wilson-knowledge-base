---
title: "How to Build Your Own Agent Harness — iii 的 Worker 架构"
date: 2026-05-30T11:00
tags:
  - agent-engineering
  - agent-harness
  - architecture
  - iii
---

## 一句话总结

Mike Piccolo 提出「Agent harness 不应该是一个框架，而是一组独立可替换的 worker」——iii 引擎将 credential、policy、approval、budget、streaming 等 15 项职责分解为独立 worker，通过统一的 `iii.trigger()` 原语组合，使「自建 harness」从 fork 框架变成 swap worker。

## 正文

Mike Piccolo（iii 创始人）在[这篇 X Article](https://x.com/mfpiccolo/status/2060069083878408689)中阐述了一个激进但自洽的论点：**当前 Agent 框架的根本问题不是功能不够，而是把 10-12 个独立职责打包成一个不可拆分的 monolith。**

### 框架之困

大多数 Agent 团队走的路径是：选一个框架（LangChain / LangGraph / OpenAI SDK / CrewAI）→ 用着用着发现某个模块不合需求 → fork 它、对抗它、或绕过它。最终，几乎所有跑长线 Agent 的团队都会从零重写自己的 harness。

原因在于，一个生产级 agent harness 实际上要承担 15 项独立职责：凭证解析、模型目录、turn 状态机、Skill 服务、prompt 组装、token 流式传输、策略检查、审批门控、预算追踪、调用钩子、会话持久化、上下文压缩、事件广播、链路追踪——而框架把它们打包成一个版本一起交付。当你想换掉其中某一个（比如策略引擎），你换的是整个 harness。

### iii 的方案：Worker 架构

iii 的赌注是：**每一个职责都应该是一个独立 worker**，通过 WebSocket 连接到共享引擎，通过统一的 `iii.trigger()` 原语互相调用。

生产栈由 11 个 worker 组成，每个独立版本化、可独立发布：

| Worker | 职责 |
|---|---|
| `harness-meta` | 入口路由、OTel 追踪种子 |
| `turn-orchestrator` | 持久化 turn 状态机 |
| `provider-*` | 各模型提供商的流式调用 |
| `models-catalog` | 模型能力目录 |
| `auth-credentials` | 凭证解析 |
| `policy` | 工具调用策略检查 |
| `approval-gate` | 人工审批门控 |
| `session` | 会话分支持久化 |
| `context-compaction` | 上下文窗口压缩 |
| `hooks-fanout` | 调用前后钩子广播 |
| `llm-budget` | LLM 消费追踪 |

每个 worker 就是一个独立进程，开 WebSocket 连引擎，注册若干函数和触发器，然后运行。合约和你自己的业务 worker 完全一致——harness 和业务逻辑构建在同一个原语上。

### 替换一个层 = 写一个 worker

文章给出了五个具体替换示例：

1. **换模型目录**：写一个注册 `models::list/get/supports` 的 worker，从实时 API 拉取，替换静态 catalog
2. **加新模型提供商**：一个文件夹 + 一个 `register.ts`，注册 `provider::<name>::stream`
3. **换 Skill 存储**：写一个注册 `directory::skills::get/list` 的 worker，对接内部文档系统或 S3
4. **覆盖 system prompt**：传 `system_prompt` 字段，orchestrator 原样使用，跳过自动组装
5. **换审批界面**：写一个 Slack worker 监听 `/approve` 命令，调同一个 `approval::resolve` 接口

每次替换的核心操作是同一个模式：找到要替换的层对应的 function id → 写一个注册相同 id 的 worker → `iii worker add` → 完成后栈的其他部分无感知切换。

### 瘦 vs 厚：不是二选一，是一个滑块

经典的 harness 争论是「thin vs thick」——Anthropic 的薄循环 vs LangGraph 的显式 DAG，选一边然后接受其所有约束。

iii 的 worker 模型把这个变成滑块：
- **瘦 harness**：turn-orchestrator + provider + auth + 最小 meta-worker。没有审批、没有预算、没有策略引擎。适合自主研究 Agent。
- **厚 harness**：全部 15 个 worker + 自定义策略 + Slack 审批 + 工作空间级别预算上限。适合跑客户工作流、每步需审计的场景。

从瘦到厚的距离不是重写，是改 config.yaml。

## 来源

- X Article: [How to build your own agent harness???](https://x.com/mfpiccolo/status/2060069083878408689) — Mike Piccolo, 2026-05-28
- iii 引擎: [github.com/iii-hq/iii](https://github.com/iii-hq/iii)
- Harness workers: [github.com/iii-hq/workers](https://github.com/iii-hq/workers)
- 文档: [iii.dev/docs](https://iii.dev/docs)

## Agent 短评

iii 的架构选择揭示了一个被框架叙事掩盖的事实：**Agent harness 不是一件事，是 15 件事。**把它们捆在一起的便利性，在你需要换掉其中一件事时变成代价。iii 给出的解是「统一总线 + 独立 worker」——和微服务在 HTTP 上的思路一致，只是粒度更细、合约更严格（function id + trigger）。这篇文章的价值不在于推广 iii 本身，而在于给出了一个**可操作的解耦标准**：如果你的 harness 里换一个层需要改其他层的代码，那它就不是真正的 harness，它只是一个你还没撞到边界的框架。
