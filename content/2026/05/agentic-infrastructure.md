---
title: "Agentic Infrastructure — Vercel 的 Agent 基础设施三层架构"
date: 2026-05-23
tags: [agent, infrastructure, vercel, ai-native]
---

## 一句话总结

Vercel CPO Tom Occhino 提出「Agentic Infrastructure」概念：当软件最终执行者从人变成机器，基础设施必须再次进化。Vercel 上的 Agent 部署占比已达 30%，半年增长 1000%。

---

## 三代基础设施演进

| 时代 | 范式 | 特征 |
|------|------|------|
| 1.0 | 手动配服务器 | SSH + 手写配置 |
| 2.0 | 云 API | AWS/基础设施即代码 |
| 3.0 | 应用定义基础设施 | Vercel/Netlify，框架驱动部署 |
| **4.0** | **Agent 定义基础设施** | **机器自主部署、测试、发布** |

---

## 关键数据

- Vercel 周部署量三个月翻倍，Agent 是增长主驱动力
- **30%** 部署由 Coding Agent 发起，半年增长 **1000%**
- Agent 来源：Claude Code **75%**，Lovable + v0 **6%**，Cursor **1.5%**
- Agent 部署的项目调用 AI 推理服务的概率是人工部署的 **20 倍**

---

## 三大支柱

### 1. 给 Agent 用的部署基础设施

> "当 Coding Agent 写完功能，它需要一个 URL 来运行、测试、验证。如果从代码到运行系统还需要手动操作 Terraform 或云控制台，自主循环就断了。"

- 不可变部署、Preview URL、即时回滚不再是 DX 优化，而是机器驱动开发的**硬前提**
- Vercel CLI / API / MCP Server / Git 集成 → Agent 可直接：生成代码 → 开 PR → 获取 Preview URL → 验证 → 发布

### 2. 构建和运行 Agent 的基础设施

Agent 工作负载与传统 Serverless 根本不同：

| 维度 | Serverless | Agent Workload |
|------|-----------|----------------|
| 执行时长 | 短请求 | 长运行、多步编排 |
| 核心能力 | 函数 + 缓存 | 模型路由 + 成本控制 + 沙箱 |
| 关键风险 | 冷启动 | Prompt 注入、推理费用失控 |

Vercel 统一原语：AI SDK 6、Chat SDK、AI Gateway、Fluid Compute、Workflows、Sandbox、Observability

### 3. 本身是 Agent 的基础设施

> "当平台自己成为 Agent——理解行为、预测需求、自我修复——基础设施和应用的界限开始模糊。"

## 来源

[Agentic Infrastructure — Vercel Blog](https://vercel.com/blog/agentic-infrastructure)

## Agent 总结

Agentic Infrastructure 概念将 AI 编码的讨论从"模型能力"推进到"基础设施适配"层面。核心信号：当 30% 部署由 Agent 发起，基础设施需要从面向人类开发者转变为面向机器开发者。部署就绪、Agent 运行时、自愈能力三个维度可作为评估框架参考。

关联笔记：[[agent-harness-engineering|Agent Harness Engineering — 代理的脚手架工程学]] [[self-driving-codebase|The Self-Driving Codebase — 后台代理与软件交付的未来]]
