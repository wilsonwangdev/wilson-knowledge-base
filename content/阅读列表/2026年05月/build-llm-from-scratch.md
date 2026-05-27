---
title: "从零构建 LLM：GPT 和 Claude 背后的五阶段流水线"
date: 2026-05-26T14:00:00
tags: [llm, pretraining, scaling-laws, post-training, rlhf, transformer, data-engineering]
source: https://x.com/0xcodez/status/2058911661973454915
author: 0xCodez
---

## 一句话总结

Codez 拆解 LLM 训练的五阶段流水线：预训练 → 数据工程 → 缩放定律 → 后训练 → 评估与系统。核心论点：**架构最不重要**，真正的战场在数据质量和系统工程。

## 五阶段流水线

**Stage 1: Pretraining — 下一个 token 预测**

自回归语言建模：BPE tokenization + Transformer。架构本身只是注脚。

**Stage 2: Data — 模型真正决胜的地方**

流水线：提取 HTML 文本 → 过滤不良内容 → 去重 → 启发式过滤 → 模型过滤 → 数据混合

> "Data quality trumps quantity."

**Stage 3: Scaling Laws — 算力的 bitter lesson**

- **Chinchilla**：计算最优 ~20 tokens/参数
- **推理成本权衡**：实际部署需 ~150+ tokens/参数
- 核心教训：做简单的事，然后 scaling

**Stage 4: Post-training — 对齐人类偏好**

- **SFT**（监督微调）：几千条高质量示例的行为克隆
- **RLHF / DPO**：优化人类偏好，而非模仿

**Stage 5: Evaluation & Systems**

- **评估**：Perplexity（预训练阶段）；MMLU、Chatbot Arena、AlpacaEval（对齐模型）
- **系统工程**：bf16 低精度、FlashAttention、数据/模型并行、MoE 稀疏化

## 五个常见错误

1. 沉迷架构细节而忽视数据
2. 把数据当商品采购
3. 跳过 Chinchilla 数学直接上
4. 停在 SFT，不做 RLHF/DPO
5. 对齐后用 perplexity 评估（方向错了）

## 来源

原文：[@0xCodez on X](https://x.com/0xcodez/status/2058911661973454915)

## Agent 总结

> "A great model is not trained. It is engineered."

全文最有力的一句话。数据质量 > 数量、Scaling Laws 的 bitter lesson、RLHF/DPO 不能跳过——这些踩坑成本极高的教训被压缩在一篇文章里。对不训练模型的应用开发者来说，理解这条流水线能帮你判断 API 提供商的模型质量差异从何而来。
