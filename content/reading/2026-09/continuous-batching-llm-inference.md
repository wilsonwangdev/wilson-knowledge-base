---
title: "How continuous batching enables 23x throughput in LLM inference while reducing p50 latency"
date: 2026-09-12T10:05
tags: [continuous-batching, llm-inference, vllm, paged-attention, throughput, latency, benchmarking, orca]
aliases:
  - 阅读列表/2026年09月/continuous-batching-llm-inference
---

## 一句话总结

Anyscale 用 A100 + OPT-13B 的受控实验证明：连续批处理（iteration-level scheduling）相比朴素静态批处理能带来最高 23 倍吞吐提升，同时反而降低中位数延迟——因为 LLM 推理是显存 IO 瓶颈而非算力瓶颈，批大小上限由显存决定，而连续批处理恰好释放了被浪费的显存。

## 核心观点

**1. 结论的根基是一个反直觉的硬件事实：LLM 推理是 memory-IO bound**

在 A100/H100 这类算力达 teraflop/petaflop 级的芯片上，LLM 仍然难以打满算力，原因是大量内存带宽被"加载模型参数"耗尽。这意味着**吞吐量主要由"能在高带宽显存里塞进多大的 batch"决定**，而不是由算力决定。作者的粗略推算很说明问题：13B 模型每个 token 约消耗 1MB 状态，A100 40GB 扣掉 26GB 权重只剩 14GB，理论上能放约 14k token——但若把序列长度限制在 512，batch 上限只有约 28 条；序列长度 2048 时 batch 上限降到 7 条。这个"7 条"就是静态批处理在小 batch 下打不满 GPU 的数学原因。

**2. 静态批处理的浪费来自生成长度的方差，而非平均值**

静态批处理的批大小在推理完成前保持不变，因此一条序列生成完毕后，它的显存和算力槽位要一直空闲等到批内最长的序列结束。作者指出：如果任务本身长度固定（比如把 LLM 当分类器、每条输出都是 1 个 token），静态批处理反而能达到最佳利用率——**问题只出现在长度方差大的真实场景**（聊天机器人既不能假设输入定长，也不能假设输出定长）。这正是 Sam Altman 说 LLM 算力成本 "eye-watering" 的结构性原因。连续批处理的解法源自 Orca 论文（OSDI '22）的 iteration-level scheduling：批大小按每轮迭代重新决定，一条序列发出 EOS 后立即插入新序列填补空缺。

**3. PagedAttention 是连续批处理之上的第二层显存优化，也是 2 倍差距的来源**

Orca 解决了"什么时候能插新请求"，但没有解决"KV cache 怎么分配"。PagedAttention（借鉴操作系统分页和虚拟内存）让 KV cache 以固定大小 block 非连续存储，attention 重写为按块对齐计算。关键收益是**分配时机从 ahead-of-time 变成 just-in-time**：不再需要在生成开始时预留 `max_context_length` 大小的连续缓冲，而是每轮迭代按需分配。基准测试里这个差异非常直观——Ray Serve 和 text-generation-inference 的连续批处理实现（同一算法）性能接近，但 **vLLM 在每个数据集上都超过朴素连续批处理一倍以上**，作者推测原因正是动态预留带来的批大小提升。

**4. 实验设计本身值得学习：用方差作为自变量**

作者固定输入（1000 条 × 512 token），只改变生成长度的方差——从指数分布（均值 128）中截取 ≤32、≤128、≤512、≤1536 的样本，对应总长度 544/640/1024/2048 四档。结果是：低方差时静态与连续批处理性能几乎相同（理论上可预期）；方差升高后朴素静态批处理吞吐暴跌至 81 token/s；FasterTransformer（高度优化的静态实现）能撑到 1536 的档位，证明优化本身能部分抵消架构缺陷；vLLM 在全档位领先。延迟测试则用 Poisson 到达模拟真实 QPS，在 QPS=1 和 QPS=4 下测 CDF——连续批处理在**所有百分位**都改善延迟，但随着系统饱和，改善幅度收窄（插入新请求的机会变少）。vLLM 的曲线在 QPS 从 1 升到 4 时几乎不变，因为它能容纳更大的批；作者观测到它在 QPS≈8、约 1900 token/s 处饱和。

**5. 它划清了三个容易混淆的术语**

文章明确区分：continuous batching 强调调度粒度是迭代级；dynamic batching 容易与"请求级批处理"混淆（后者仍等当前批全部完成才组下一批）；iteration-level scheduling 描述了调度机制但不足以涵盖整个过程。同时澄清了一个实现细节：prefill 的计算模式和 token 生成不同，不能简单地混在一起批处理，现有框架用 `waiting_served_ratio` 这类超参数来平衡"等待 prefill 的请求"与"等待 EOS 的请求"的比例——这为后来 vLLM V1 能在同一 step 内混合 prefill/decode 埋下了问题定义。

## 关键引用

> "LLM inference is memory-IO bound, not compute bound. In other words, it currently takes more time to load 1MB of data to the GPU's compute cores than it does for those compute cores to perform LLM computations on 1MB of data. This means that LLM inference throughput is largely determined by how large a batch you can fit into high-bandwidth GPU memory."

> "Instead of waiting until every sequence in a batch has completed generation, Orca implements iteration-level scheduling where the batch size is determined per iteration."

> "What is most impressive here is vLLM. For each dataset, vLLM more than doubles performance compared to naive continuous batching. We have not analyzed what optimization contributes the most to vLLM performance the most, but we suspect vLLM's ability to reserve space dynamically instead of ahead-of-time allows vLLM to dramatically increase the batch size."

## 来源

- [How continuous batching enables 23x throughput in LLM inference while reducing p50 latency — Anyscale](https://www.anyscale.com/blog/continuous-batching-llm-inference)

## Agent 短评

这是"用受控实验讲清楚一个架构决策为什么成立"的范文——把生成长度方差当自变量、把吞吐和延迟 CDF 当因变量，让"连续批处理更好"从工程经验变成可复核的结论。它的独特价值不在介绍连续批处理（这个概念自 Orca 发表后已被广泛复述），而在**把收益拆成两层并量化第二层的贡献**：Orca 的迭代级调度是第一层，PagedAttention 的动态显存分配是第二层，而第二层带来的差距（1 倍以上）比第一层本身更显著。局限有三：一是 2023 年发布、基准基于 A100 + OPT-13B + 单一框架版本，数字（23x、1900 token/s、QPS≈8 饱和）不应外推到 H100 或 MoE 模型；二是 23x 这个标题数字对应的是"朴素静态批处理"这个很弱的基线（Hugging Face Pipelines），与高度优化的 FasterTransformer 对比时差距要小得多，作者也承认后者的 4x 提升"同样令人印象深刻"；三是文末承认没有做归因分析，vLLM 的优势"推测"来自动态预留——所以结论方向可信，具体倍数只能当量级参考。想理解后续演进的话，可以把它当作 PagedAttention 论文的通俗引子，再对照 vLLM 内部实现（Aleksa Gordić 那篇）看这些机制今天长什么样。
