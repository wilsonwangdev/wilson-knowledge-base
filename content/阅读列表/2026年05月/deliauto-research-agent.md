---
title: "DeliAutoResearch：DeepSeek 研究员的 Agent 自动写论文实践"
date: 2026-05-27T09:00:00
tags: [agent, research, autonomous, classification, deepseek, automated-research, skill]
source: https://mp.weixin.qq.com/s/u8RZZ3_PgaxAXmH-quV0wg
author: 量子位（梦晨）| 原始作者：陈德里（DeepSeek）
---

## 一句话总结

DeepSeek 研究员陈德里发布 DeliAutoResearch 技能：DeepSeek-V4-Pro 自动搜索/写作、GPT-Image2 画图，6 天 108 轮 Agent 调用生成 46 页综述论文。同时提出 Agent 自主度 L1-L5 分类体系，分析 17 个主流系统，列出六大开放问题。

## 实践数据

一篇 46 页综述论文的 Agent 协作报告：
- 6 天迭代 6 版（V1: 4 次，V2: 1 次，V3: 1 次）
- 108 轮 Agent 调用，消耗 64.8 万 token
- 生成 2234 行 LaTeX 代码
- 103 个参考文献，全部已验证
- 7 个图表 + 4 个表格
- 人类"碳基大脑总 CPU 时间"不到 2 小时

## L1-L5 自主度分类体系

类比自动驾驶 SAE 分级，将研究 Agent 按自主度分为五级：

| 级别 | 名称 | 代表 |
|------|------|------|
| L1 | 自动补全 | GitHub Copilot（最早版本），预测下一行 |
| L2 | 任务执行 | ChatGPT/Claude + 工具，每步需人类批准 |
| L3 | 多步执行 | Claude Code、Cursor Agent，10-100 步自主，关键点人工审核 |
| L4 | 受限领域全自主 | 当前前沿——人类给目标、评估成果，Agent 完成实验/代码/论文 |
| L5 | 自定研究议程 | 未实现——自主选题、分配资源、跨领域积累、持续研究 |

核心瓶颈：**持续知识积累** 和 **可靠自我评估**。

## 四种架构模式

| 模式 | 代表 | 特点 |
|------|------|------|
| 单智能体循环 | ReAct、Reflexion、LATS | 简单高效，复杂任务能力有限 |
| 多智能体协作 | CAMEL、AutoGen、MetaGPT | 分工协作，多视角纠错，成本高 |
| 分层调度 | Claude Code、Devin | 分层规划、任务分解，适合长期复杂研究 |
| 工具增强执行 | SWE-Agent | 代码执行/浏览器/API/多模态，ACI 设计决定性能 |

实际应用中多为混合架构。

## 17 个系统横向对比

基于六维特征矩阵分析，显示领域已从早期通用脆弱原型演进为 L4 级受限域专用系统。代码智能体成熟度最高，科学智能体开始产出可验证新发现。

## 六大开放问题

1. **认知循环陷阱**：Agent 陷入重复无效策略，无自我终止能力
2. **上下文限制**：固定窗口（4K-1M token）无法支撑长时程研究
3. **创新性评估**：无自动化方法衡量研究原创性与价值
4. **可复现性**：模型随机性、提示敏感性导致结果无法复现
5. **安全伦理**：双用途风险、自主提升风险、学术诚信风险
6. **成本问题**：单任务成本 ~$50，高成本加剧科研不平等

## 来源

量子位报道：[DeepSeek陈德里开发自动研究Skill，写一篇论文人类只动脑2小时](https://mp.weixin.qq.com/s/u8RZZ3_PgaxAXmH-quV0wg)

原始博客：[陈德里 X/Twitter](https://x.com/victor207755822/status/2059269472297623843)

## Agent 短评

"人类总 CPU 时间 < 2 小时" 这句话比任何 benchmark 都更有传播力。L1-L5 分类用 SAE 类比降低了理解门槛，但六大开放问题才是真正有价值的部分——每个都是长任务 Agent 工程要踩的坑。代码 Agent 让 CS 论文数量膨胀的观察也值得警惕：产出效率提升的同时，创新性评估成了新的瓶颈。
