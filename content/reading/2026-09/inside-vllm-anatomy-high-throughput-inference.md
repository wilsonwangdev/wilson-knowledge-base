---
title: "Inside vLLM: Anatomy of a High-Throughput LLM Inference System"
date: 2026-09-12T10:00
tags: [vllm, llm-inference, paged-attention, continuous-batching, speculative-decoding, kv-cache, disaggregated-serving, benchmarking]
aliases:
  - 阅读列表/2026年09月/inside-vllm-anatomy-high-throughput-inference
---

## 一句话总结

Aleksa Gordić 从单个 Python `LLM.generate()` 调用出发，逐层拆解 vLLM V1 引擎的全部内部机制——调度器、PagedAttention、KV-cache 管理、投机解码、分离式 P/D 部署、多机多卡服务架构——是目前公开资料中对 vLLM 内部实现最系统的分析。

## 核心观点

**1. vLLM 的性能优势本质来自"把 KV-cache 当操作系统内存来管"**

引擎核心由 Scheduler（FCFS 或优先级策略 + waiting/running 双队列）和 KV-cache manager 构成，后者维护一个 `free_block_queue`（空闲块池，规模可达数十万块）。每个块默认存 16 个 token，块大小按 `2 * block_size * num_kv_heads * head_size * dtype_bytes` 计算。调度时 `allocate_slots` 只做三件事：算出需要几个新块（17 个新 token 需要 ceil(17/16)=2 块）、检查池子里够不够、从双向链表头部取块并记录 `req_to_blocks` 映射。这个设计让显存浪费被限制在最后一个不满的块内——这就是 PagedAttention 相比"按最大序列长度预分配连续缓冲区"的本质优势。

**2. Prefill 和 decode 的性能特征相反，vLLM V1 让它们在同一个 step 内共存**

Prefill 是对全部 prompt token 做前向（compute-bound），decode 只处理最近一个 token（memory-bandwidth-bound，因为仍要加载全部权重）。V0 引擎一次只能处理其中一种，V1 的调度器则优先处理 running 队列里的 decode 请求，再消耗剩余 token budget 处理 waiting 队列的 prefill。转发时所有序列被打平拼接成一条"超级序列"，靠位置索引和 attention mask 保证各序列只看自己的 token——这使得连续批处理无需右侧 padding 即可支持。

**3. 前缀缓存的实现揭示了 PagedAttention 的核心思想**

`hash_request_tokens` 把 prompt 切成 16-token 块，每块的哈希由"上一块哈希 + 当前 token + 可选元数据（多模态哈希、LoRA ID、cache salt）"链式组合而成。第二次遇到相同前缀时，`find_longest_cache_hit` 做线性搜索即可命中已缓存的 KV 块直接复用。作者点明：**看懂了前缀缓存，就看懂了 PagedAttention 的工作原理**。默认开启，`enable_prefix_caching=False` 关闭。

**4. 投机解码在 vLLM 里换了实现路线，且不牺牲正确性**

标准方案用小模型起草 k 个 token、大模型一次验证。接受/拒绝规则（大模型概率 ≥ 草稿概率则接受，否则以 `p_large/p_draft` 概率接受）保证**期望上与大模型逐 token 采样在统计上完全等价**，因此速度提升不以质量损失为代价。但 vLLM V1 不支持独立草稿模型，改用更快但精度略低的方案：n-gram（在已生成序列里找历史匹配）、EAGLE（保留 embedding 和 LM head、把 transformer 栈换成轻量 MLP 微调）、Medusa（在大模型 embedding 之上训辅助线性头并行预测 k 个 token）。

**5. 分离式 P/D 是把两种相反负载物理隔离**

既然 prefill 是计算密集、decode 是带宽密集，把它们跑在同一批硬件上必然互相干扰。vLLM 的做法是跑 N 个 prefill 实例 + M 个 decode 实例，按实时请求混合比例自动扩缩；prefill worker 把 KV 写进专用 KV-cache 服务，decode worker 从中读取。授权控制因此更精细：TTFT 由 prefill 集群决定，ITL 由 decode 集群决定。文中用 `SharedStorageConnector`（调试用实现）演示了 CPU/GPU 间的 KV 传输机制，并提醒 Connector 接口尚未稳定。

**6. 延迟与吞吐的权衡可以用 roofline 模型量化**

在饱和批量 `B_sat` 之前，单步耗时由 HBM 带宽主导（把权重逐层流进片上内存），所以处理 1 个和 10 个 token 的耗时几乎相同——这解释了为什么小批量下加大 batch 几乎不损延迟；超过 `B_sat` 后 kernel 变成 compute-bound，每多一个 token 都直接抬高 ITL。作者还补充了 kernel auto-tuning 的影响：随着 B 增长，运行时可能切换到该形状更高效的 kernel，`P_kernel` 本身在变，所以 `t = FLOPs_step / P_kernel` 不是简单线性。基准测试 CLI 提供 `vllm bench {serve,latency,throughput}`，其中 serve 模式按 Poisson 分布采样请求到达时间，最接近真实负载；官方还提供按 SLO 反推配置的 auto-tune 脚本。

## 关键引用

> "Because the forward pass flattens the batch into a single sequence and custom kernels handle it efficiently, continuous batching is fundamentally supported even in the synchronous engine."

> "Prefill and decode have very different performance profiles (compute-bound vs. memory-bandwidth-bound), so separating their execution is a sensible design. It gives tighter control over latency — both TTFT (time-to-first-token) and ITL (inter-token latency)."

> "And that's the gist of prefix caching: don't recompute prefixes you've already seen — just reuse their KV cache! If you understood this example you also understood how paged attention works."

> "Although we use the small model to propose candidates, the accept/reject rule guarantees that in expectation the sequence is distributed exactly as if we had sampled token by token from the large model."

## 来源

- [Inside vLLM: Anatomy of a High-Throughput LLM Inference System — Aleksa Gordić](https://www.aleksagordic.com/blog/vllm)

## Agent 短评

这篇的价值在于它是**从代码调用栈往上倒推系统设计**，而不是从概念往下讲理论——读者跟着 `LLM.generate()` 的执行路径走，会自然理解为什么需要 paged KV cache（因为调度器要按 step 动态分配）、为什么需要 chunked prefill（否则长 prompt 独占整个 step 阻塞其他请求）、为什么需要分离式 P/D（两种负载的硬件特性相反）。三个局限：一是明确声明基于 commit 42172ad（2025-08）且只覆盖 V1 引擎，V0 已废弃；二是聚焦标准 transformer，MoE 的专家并行、混合模型（Jamba 这类 Transformer/SSM 混合）需要更复杂的 KV-cache 分配器，只在注释里带过；三是 disaggregated P/D 部分承认 Connector 接口尚未稳定、后续可能有破坏性变更，所以那段的代码示例（SharedStorageConnector）是教学用途而非生产配置。作为系列第一篇，它采取"先宽后深"的倒金字塔写法，后续篇章才会深入单个子系统——这意味着看完这篇你知道系统长什么样，但每个子系统的调优细节还需等后续文章。
