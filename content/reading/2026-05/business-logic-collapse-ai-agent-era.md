---
title: '业务逻辑的"坍塌"：AI Agent 时代应用层还剩什么'
date: 2026-05-27T12:00:00
tags: [agent, architecture, llm, context-engineering, distributed-systems, prompt-engineering, software-engineering]
source: https://mp.weixin.qq.com/s/kVE6an0dqnO34SQnRXddWg
author: 韩春（阿里云开发者）
aliases:
  - 阅读列表/2026年05月/business-logic-collapse-ai-agent-era
---

## 一句话总结

LLM 正在把应用层的复杂业务逻辑压扁成胶水代码。从"怀疑 AI 是泡沫"到"理解并驾驭 AI"，作者通过手写 Agent、拆解 LangChain、对照分布式架构，系统论证了：AI Agent 开发的核心不是模型调参，而是 Context 工程——在不确定性中构建可用系统。

## LLM 不确定性不是 Bug，是 Feature

**温度设为 0、top-k 设为 1，固定输入输出仍可能不同。** 原因分层：
- **MoE 架构**：FFN 只激活部分神经元，路由和负载均衡引入随机性
- **浮点精度**：FP16/BF16 经层层矩阵运算累积误差，argmax 可能选出不同 Token
- **硬件异构**：一次在 A100 一次在 H100，微小差异导致首个 Token 偏移后路径根本改变

这个不确定性 = f(数值精度, 硬件异构, 运行时架构, 采样策略)，物理上不可消除，是模型厂商为低成本高吞吐主动让渡的精确性。**System Prompt vs User Prompt 的区分本质上是和 KV Cache 前缀缓存的博弈**——利用 System Prompt 不变性减少矩阵运算量和 TTFT 延迟。

**结论：我们无法消除一个无法被消除的东西，只能理解并接受。**

## AI 开发 ≈ Context 开发

过去认为 AI 开发就是申请 API Key 然后 HTTP 调用。实际开发和上线风险评估 Agent 后的认知转变：

- **AI 应用开发视角**：AI 开发 ≈ Prompt 组装 ≈ Context 开发（加上 RAG、Memory 管理）
- **完整问题解决视角**：还需包括 Pre Training 和 Fine Tuning

两者区别在于**业务知识内化的阶段**：通用知识预训练固化在参数中，时效性/个性化知识通过 Prompt 在推理阶段注入。

**架构范式翻转**：
- 传统微服务：无状态应用 + 有状态数据库
- AI 时代：应用层 Agent 成为有状态节点，LLM 是无状态推理节点

Context 的本质是**状态管理**——受 Attention 中间遗忘、Token 成本、窗口限制等约束的工程化落地手段。三种管理策略：状态压缩（小模型总结历史）、状态显现化（Cursor 式可交互规划）、结构化知识（知识图谱注入）。

## 手搓 Agent：在不确定性中构建可用系统

作者用本地 ollama + deepseek-r1:8b 实现了一个渗透测试 Agent（nmap + nuclei），完整的 ReAct 循环：

```
Think → Act → Observe → Think
```

从中提炼出 Agent 开发六大关键点：Prompt 工程、Context 管理、输出解析、工具编排、异常处理、质量评测。随后用一段完整伪代码系统梳理了 RAG（chunk_size/overlap 为什么是这个数？）、Memory（短期/长期划分是否合理？）、Multi-Agent（子 Agent 失败怎么恢复？）、循环检测、安全围栏等模块——**每个环节都附上了工程上的疑问和不确定性**，正是这种"不确定的确定性"构成了 Agent 开发的日常。

## LangChain 的真实价值

**LangChain 的编排能力被高估了**：
- ReAct = while + if
- Workflow = if + elif + else
- LangGraph = Workflow + StateNode
- Plan-Exec = for + function call

其真正价值在于**语义层面的标准化**——定义了 AI Agent 开发的标准流程和组件接口。尤其是对 Message 角色的规范（System/User/Assistant/Tool），让开发者从"一股脑揉成大 Prompt"进化到结构化交互。类比 Java 生态的 SSH（Struts + Spring + Hibernate）。

但依赖基础模型未来演进方向：一旦 Attention 机制突破窗口限制，Context 管理的职责可能进一步转移到模型层面。ReAct vs Workflow 的选择也可能向完全 ReAct 迁移。

## 混合架构的必然性

**LLM 不适合所有任务。** 三类适合场景：
1. **非结构化输入 → 结构化输出**：合同审核、会议纪要
2. **模糊检索与语义对齐**：自助答疑、文档自动更新
3. **长尾问题概率性兜底**：输入参数多、问题域不收敛

但即使在这三类中，也需要定义 AI 能力边界：AI 做风险检测但不下发处置，确定流程继续用规则引擎，AI 不替代人类无法解释的决策。

**故障模式从级联到概率雪崩**：
- 过去：物理资源不足 → 服务降级 → 级联故障
- 现在：单步推理错误 → 错误前提传播 → 后续步骤全部基于错误前提

**控制论视角**：ReAct 本质是闭环负反馈控制。但问题在于 Observation 观察的仍是 LLM 返回，没有跳出 LLM 语义空间。真正的突破方向是引入**真实世界的反馈**——如 Agent 配置网络设备后，通过真实流量异常触发回滚。

## AI 基础设施的硬件本质

分布式系统的圣杯是数据一致性，**AI 系统的圣杯是数据局部性**。谁能把数据放在离计算单元最近的地方（SRAM > HBM > NVLink > PCIe），谁就掌握算力霸权。

B300 的硬件参数：640 Tensor Cores（15 PFLOPS FP4）、288GB HBM3E（8TB/s）、NVLink 1800GB/s。GPU 90% 时间在搬运数据，只有 10% 做矩阵运算。这也是 B300 优于 H20 但国内无法引进的原因——GPU 从训练到推理深度耦合，换卡不是重新编译而是需要重写算子甚至重新训练。

## 来源

[业务逻辑的"坍塌"：当应用层只剩下胶水代码，在 AI Agent 时代，我们该构建什么](https://mp.weixin.qq.com/s/kVE6an0dqnO34SQnRXddWg)

## Agent 短评

这是近期读到的最有工程体感的中文 AI 文章——不是因为内容有多新颖，而是它把 AI Agent 开发中那些"不好意思说出口的荒诞感"讲透了：在 Prompt 最后反复强调"输出 JSON"才能生效、几十行胶水代码包装着完全黑盒的推理过程、上线时通过所有评测但一行代码不改也可能出 bug。控制论视角（ReAct 是闭环控制）和分布式架构对照（无状态 vs 有状态翻了个个儿）的类比尤其精彩。给这篇文章一句话：它回答的不是 AI 能做什么，而是在 AI 能做的事情里，架构师和工程师的位置在哪里。
