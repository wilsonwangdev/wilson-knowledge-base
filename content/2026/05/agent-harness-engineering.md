---
title: "Agent Harness Engineering — 代理的脚手架工程学"
date: 2026-05-10
source: https://x.com/addyosmani/status/2053231239721885918
tags: [agent, harness, engineering]
---

# Agent Harness Engineering — 代理的"脚手架工程学"

## TL;DR

**Agent = Model + Harness。** 模型只是代理系统的一个输入，真正决定代理能否完成任务的，是包裹在模型外围的整个"马具"——提示词、工具、沙箱、钩子、子代理、反馈回路。中等模型+优秀harness，长期碾压优秀模型+糟糕harness。

## 核心观点

### 1. Harness 是什么？

"如果你不是模型，你就是 harness。" Harness 包含：系统提示词、AGENTS.md、技能文件、工具、MCP、沙箱、子代理编排、hooks、可观测性等。

### 2. 棘轮机制

每一条系统提示词都应追溯到一次具体的历史失败。对 harness 只加不减：只有观察到真实失败才加约束，只有模型能力显著提升时才移除冗余规则。

### 3. Hooks 是执行层

成功静默，失败喧哗——类型检查通过则代理无感，失败则错误注入循环驱动自我修正。

### 4. Harness 不消失，只迁移

模型越强，harness 需求位移而非消失。旧约束该删就删，新脚手架该建就建。

## Wil 的思考

这篇文章命名了一个正在发生的范式转移。过去两年所有人比较模型智商，但瓶颈早不在模型层。棘轮隐喻精准：每犯一次错就锁定一个改进。Harness 与模型训练之间的反馈回路也值得关注——最佳 harness 永远是针对你自身任务和流程的，不存在通用最优解。
