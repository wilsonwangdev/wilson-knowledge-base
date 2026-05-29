---
title: "Perplexity Computer 深度解析：Sandbox Matrix 架构"
date: 2026-03-06
tags: [perplexity-computer, sandbox-matrix, multi-model-orchestration, micro-vm, agent-architecture]
aliases:
  - 阅读列表/2026年03月/perplexity-computer
---

## 一句话总结

Perplexity Computer 底层采用 E2B Firecracker 微虚拟机技术（150ms 冷启动），编排 19 个 AI 模型智能路由，通过任务图并行执行，月运行规模达数百万沙箱。

## 技术内幕

1. **Sandbox Matrix 架构**：底层基于 E2B 的 Firecracker 微虚拟机（AWS 开源技术），约 150-170ms 冷启动，比 Docker 更强隔离，月运行规模达数百万沙箱。

2. **多模型编排**：19 个不同 AI 模型专业化分工——Claude Opus 做核心推理、Grok 处理快速轻量任务、ChatGPT 做长上下文回忆、Gemini 做深度研究。

3. **任务图机制**：将用户宏观目标分解为可并行执行的子任务，分配到不同沙箱中异步执行，支持横向扩展。

4. **全能力沙箱**：每个沙箱具备真实文件系统、AI 原生浏览器（Comet）和数百个连接器（Gmail/Slack/Notion/GitHub 等），远超传统云端 AI 服务。

5. **持久内存进化**：从追求容量转向追求精度，确保跨任务状态的高质量传递。

> "现在每月运行数百万个 E2B 沙箱"

## 来源

[@xds2000 — X 深度分析](https://x.com/xds2000/status/2029433337895653466)
