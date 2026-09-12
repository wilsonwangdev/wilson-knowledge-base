---
title: "LLM Inference Benchmarking: Fundamental Concepts"
date: 2026-09-12T10:15
tags: [llm-inference, benchmarking, ttft, itl, tpot, throughput, genai-perf, load-testing, capacity-planning]
aliases:
  - 阅读列表/2026年09月/llm-inference-benchmarking-concepts
---

## 一句话总结

NVIDIA 把 LLM 推理基准测试拆成"指标定义 + 参数选择 + 工具差异"三个层面，最有价值的不是公式本身，而是揭示了同一个指标在不同工具里的口径差异（ITL 是否含 TTFT、TPS 分母取什么）足以让两组数字无法对比。

## 核心观点

**1. 负载测试和性能基准测试是两件事，混用会得出错误结论**

负载测试（load testing）模拟大量并发请求，关注的是服务器容量、自动扩缩容策略、网络延迟、资源利用率——回答"系统扛不扛得住真实流量"。性能基准测试（如 NVIDIA 的 GenAI-Perf）测量模型自身的吞吐、延迟和 token 级指标，关注模型效率、优化和配置——回答"模型跑得够不够快"。作者的建议是两者结合：负载测试保障容量，基准测试指导优化，只看其中一个会漏掉另一半问题。

**2. 指标之间的代数关系决定了哪些数字可以独立优化**

- **TTFT**（首 token 时间）：包含请求排队、prefill 计算和网络延迟。prompt 越长 TTFT 越大，因为 attention 必须处理完整输入序列才能建立起 KV cache。生产环境中一个请求的 prefill 可能与另一个请求的 generation 重叠，所以 TTFT 不是纯粹的 prefill 耗时。
- **e2e_latency**（端到端）= `TTFT + generation_time`，即"提交查询到收到完整响应"的总时间（流式模式下反分词会执行多次）。
- **ITL / TPOT**（token 间延迟 / 每输出 token 时间）：序列中相邻 token 生成的平均间隔。GenAI-Perf 的定义是 `(e2e_latency − TTFT) / (Total_output_tokens − 1)`——**分母减 1 是为了排除首 token**，让 ITL 纯粹反映 decode 阶段的特性。

作者点出一个常被忽视的机制：输出序列越长，KV cache 越大、显存成本越高，每新增一个 token 的 attention 计算成本随"输入+已生成"长度线性增长——但这个计算通常不是 compute-bound，所以**稳定的 ITL 说明内存管理和带宽利用良好、attention 计算高效**。这为"用 ITL 曲线诊断系统健康状况"提供了依据。

**3. 同一个指标在不同工具里的口径差异，比指标本身的定义更值得警惕**

这是全文最实用的部分：

- **ITL**：GenAI-Perf 的平均值**不含 TTFT**，LLMPerf 则**含 TTFT**。同样一段推理，两个工具报出的 ITL 不同。
- **TPS（per system）**：GenAI-Perf 定义为 `总输出 token / (最后响应时间 − 首个请求时间)`；LLMPerf 定义为 `总输出 token / 整个基准测试时长`——后者因此把输入 prompt 生成、请求准备、响应存储这些开销也算进去了。作者观测到**这些开销在单并发场景下有时能占到整个基准测试时长的 33%**。
- **测量方式**：GenAI-Perf 用滑动窗口找稳定区间，把"预热"和"收尾"的请求排除在计算之外；它也不计入空内容的初始响应（因为首响应没有 token 时 TTFT 无意义）。

**结论是：跨工具对比数字之前必须核对口径，否则 33% 的系统性偏差会被误读成性能差异。**

**4. 应用类型决定了 ISL/OSL 的形状，而形状决定优化方向**

作者给出四类典型用例及其序列长度特征：

- **翻译**（含代码翻译）：ISL 与 OSL 量级相当，各约 500~2000 token
- **生成**（代码、故事、邮件、搜索内容）：OSL 约 O(1000) 远大于 ISL 约 O(100)——**decode 主导**
- **摘要**（检索、思维链、多轮对话）：ISL 约 O(1000) 远大于 OSL 约 O(100)——**prefill 主导**
- **推理**（显式思维链、自我反思验证，用于代码/数学/谜题）：ISL 约 O(100) 而 OSL 达 O(1000~10000)——**极端 decode 主导**

对应关系很直接：ISL 越长，prefill 的显存需求和 TTFT 越高；OSL 越长，generation 阶段对显存带宽和容量的需求越大、ITL 越高。**不先搞清楚自己部署场景里 ISL/OSL 的分布，硬件选型和优化就是盲目的。**

**5. 负载控制参数的选择有明确的最佳实践**

- **并发数（concurrency）**：始终维持 N 个活跃请求，一个完成就立刻补上另一个。作者**推荐用并发而非请求速率**来控制负载，因为请求速率超过系统吞吐时未完成请求数会无界增长。
- **最大化批大小（max batch size）**：推理引擎单次能同时处理的请求数上限。当并发数超过"批大小 × 副本数"，多余请求只能排队，表现为 TTFT 上升。
- **扫描范围**：从 1 开始扫到**略大于最大批大小**即可——因为并发超过批大小之后，吞吐会趋于饱和而延迟继续稳定上升，继续加压只是在测队列而非测引擎。
- **工具差异**：LLMPerf 按 N 个一批发送，批内有排空期（并发逐渐降到 0）；GenAI-Perf 全程维持 N 个活跃请求。
- **采样参数**：基准测试时应设 `ignore_eos=True` 以强制生成到目标长度、保证测量一致；采样方法（greedy/top_p/top_k/temperature）会影响速度（greedy 无需归一化和排序概率分布，计算量更小），关键是**同一组基准测试内保持一致**。

## 关键引用

> "In our observation, these overheads in the single concurrency scenario can sometimes account for 33% of the entire benchmark duration."

> "Concurrency is most frequently used to describe and control the load induced on the inference system."

> "Consistent ITLs signify efficient memory management and better memory bandwidth as well as efficient attention computation."

> "When specifying the concurrencies to test, it is useful to sweep over a range of values, from a minimum value of 1 to a maximum value not much greater than the maximum batch size."

## 来源

- [LLM Inference Benchmarking: Fundamental Concepts — NVIDIA Developer Blog](https://developer.nvidia.com/blog/llm-benchmarking-fundamental-concepts)

## Agent 短评

大多数人读基准测试文章是想要"该测什么指标"，这篇的实际贡献在更隐蔽的地方——**它告诉你为什么你测出来的数字和别人的对不上**。ITL 含不含 TTFT、TPS 分母是整个基准时长还是首末请求时间差、是否做了预热裁剪，这些口径差异造成的偏差（文中明确举例可达 33%）远大于很多被当作性能差异讨论的工程细节。这一点对做容量规划和跨供应商比价的人尤其关键：拿 A 工具的 TPS 去对比 B 工具报的 TPS，很可能只是在比两个不同定义的量。另外"并发扫到略高于最大批大小就够"这条建议省下了大量无效压测。局限方面：文章明显是 GenAI-Perf 的配套读物（GenAI-Perf 作为推荐口径反复出现，NVIDIA 自家工具处于基准位置），对 LLMPerf、vLLM 的 `bench serve`、locust 等替代方案的覆盖只是对照提及；指标定义也偏向单副本视角，多副本、跨节点、prefill/decode 分离部署下的聚合口径没有展开；此外全文不涉及成本维度（$/百万 token、显存占用效率），而这在实际选型中往往比纯延迟指标更硬。适合作为口径词典来查，配合 vLLM 那篇的 roofline 模型和 `vllm bench serve` 的 Poisson 到达模型一起看，能拼出比较完整的测量方法论。
