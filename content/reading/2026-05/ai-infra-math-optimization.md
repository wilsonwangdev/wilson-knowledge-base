---
title: "万字入门AI Infra：大模型中的数学与Infra优化"
date: 2026-05-27T11:00:00
tags: [ai-infra, transformer, deep-learning, optimization, rmsnorm, softmax, flash-attention, gpu]
source: https://mp.weixin.qq.com/s/EHXBbN-G5X05rKTo1GpQkA
author: 刘斌（腾讯云开发者）
aliases:
  - 阅读列表/2026年05月/ai-infra-math-optimization
---

## 一句话总结

从 RMSNorm → Softmax → Causal Mask → Sampling，用数学等价变换和精度妥协换取硬件利用率和推理速度。不到 5 万字，串联大模型推理中核心操作的数学原理与 Infra 优化逻辑。

## RMSNorm：从方差到归一化的工程选择

**为什么需要归一化？** 深层 Transformer 的输入张量经过连续矩阵乘加后数值分布剧烈变化，FP16 上限仅 65504，BF16 虽不易溢出但尾数仅 7 bit 导致"大数吃小数"。LayerNorm/RMSNorm 将数据约束在安全物理尺度内。

**方差为何用平方不用绝对值？** 绝对值函数在 0 点不可导，无法用于反向传播求最优解。平方（抛物线）可导且平滑，方差由此统治统计学。但平方扭曲了单位和数值——标准差（开根号）既保留求导优势又还原直觉尺度，几何上等价于高维空间里的欧氏距离。

**Z-score 标准化**（减均值、除标准差）使新数组均值为 0、方差为 1。LayerNorm 即对同一 Token 内所有特征维度做 Z-score + 仿射变换（γ, β）。但 RMSNorm 发现**均值平移（减 μ）对收敛贡献微乎其微**，砍掉均值计算后：

- 打破数据依赖：无需先算 μ 才能算 σ²，只需一次单向 Reduction
- 省掉大量 element-wise 减法，寄存器/SRAM 占用减半
- 通常连 Bias 参数（β）一并去掉——现代 LLM 几乎所有 Linear 层都无 Bias

**Post-Norm → Pre-Norm**：Post-Norm（y = Norm(x + f(x))）主干路径被多个 Norm 打断，梯度在深层消失，需长周期 Warm-up 打补丁。Pre-Norm（y = x + f(Norm(x))）将 Norm 挪入残差支路，主干梯度无损回传，但带来表征坍塌（深层新增特征相对主干越来越微不足道）。DeepNorm 试图让 Post-Norm 重回舞台但未成主流——Pre-Norm + RMSNorm 已成事实标准且 Infra 已极致优化。

## Softmax：概率归一化的数学与工程

**核心公式**：将任意实数 Logits → 总和为 1 的概率分布，同时放大差异。

**Safe Softmax（-M）**：先减最大值 M 再算指数，因为 e^zᵢ⁻ᴹ ≤ 1，彻底解决 FP16 上溢。结果不变（Softmax 只关心相对差值）。

**为什么除以 √dₖ？** Attention 的点积结果方差随维度 dₖ 膨胀到 dₖ 倍。除以 √dₖ 将 Logits 方差拉回 1，防止 Softmax 退化到 Hard Max 导致梯度消失。√dₖ 基于理想统计假设（q、k 独立且均值为 0 方差为 1），真实网络并不严格满足——但在初始化第一步稳住量级，后期参数更新自会适应。

**Causal Mask（因果掩码）**：对未来 Token 位置（j > i）的 Logit 加上 -∞（工程上用 -65504），使 Softmax 输出为 0。现代 FlashAttention 在底层用块稀疏（Block Sparsity）——对角线以上完全跳过，仅边界块内实时判定，将 Attention 计算量和访存量砍掉近一半。Decode 阶段因果天然成立，根本无需掩码。

## Online Softmax 与 FlashAttention

**朴素实现的 3 次 HBM 遍历**（找最大值 → 算分母 → 算结果）在算力远超带宽的今天成为瓶颈。**Online Softmax** 的核心思想：维护局部的 running max 和 running sum，读入新块时用动态缩放因子对旧结果修正——1 pass 完成找最大值 + 算分母。

**FlashAttention** 将此思想推广到整条 Attention 流水线：对每个 Q tile 沿 K/V 方向做一次融合遍历，同时完成 S=QKᵀ、online softmax、O+=PV。中间矩阵 S、P 始终活在寄存器中，不写回 HBM。

**FlashAttention v2 的关键改进**：
- 外层 Q / 内层 KV（v1 相反），Q 状态可长驻寄存器，只在最后一次性写入 HBM
- Grid 维度加入 Q 序列长度，并行度大幅提升
- 利用 L2 cache：相邻 CTA 命中 L2（带宽约为 HBM 的 4 倍），KV 实际 HBM 读取次数接近 N_kv

**LSE（Log-Sum-Exp）的价值**：用 1 个 FP32 标量替代 2 个(m, ℓ)，省一半写带宽。反向传播时用 P = e^S⁻ᴸˢᴱ 精准重算，化除法为减法，打破 HBM 带宽墙。Split-K 时各 SM 只写回局部 LSE，最终 Reduction 完美缝合。

## Sampling：Gumbel-Max Trick

传统 Multinomial Sampling 需要串行计算前缀和，128K 词表下 GPU 并行度极差。**Gumbel-Max** 的优雅等价变换：给 log(p) 加标准 Gumbel 噪声后取 argmax，数学上与轮盘赌完全等价。

vLLM 的工程实现更简洁：`probs.div_(q).argmax()`——q 为标准指数分布噪声。好处：
- 完全独立的 element-wise 操作，无数据依赖
- argmax 为并行 Reduction
- **贪心采样和随机采样被统一为同一条执行流**（随机采样多一步除以噪声），消灭分支发散
- 多卡 TP 下只需 All-Reduce(MAX with index)，通信量从 O(V) 降到 O(world_size)

## 来源

[万字入门AI Infra：深入理解大模型中的数学与Infra优化](https://mp.weixin.qq.com/s/EHXBbN-G5X05rKTo1GpQkA)

## Agent 短评

这篇文章的科普水平在中文 AI Infra 内容里数一数二——从"为什么方差用平方不用绝对值"这种高中问题讲起，一直推到 FlashAttention-4 的 SFU/ALU 软硬协同。更难得的是诚实：√dₖ 不严格满足假设？"不管黑猫白猫，能捉老鼠的就是好猫"；权重初始化 std=0.02 而非 1/√d_model？"量级对了就行，不需要严谨的数学"。这种工程实证主义的坦诚，比故作高深有用得多。结尾那句"试错的速度，往往决定了模型进化的速度"是对当前 AI 阶段最准确的概括。
