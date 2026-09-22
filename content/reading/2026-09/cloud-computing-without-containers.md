---
title: "Cloud Computing without Containers"
date: 2026-09-22T13:30
tags: [serverless, cloudflare-workers, v8-isolates, edge-computing, containers, kubernetes, webassembly, cloud-architecture]
aliases:
  - 阅读列表/2026年09月/cloud-computing-without-containers
---

## 一句话总结

Cloudflare 的 Zack Bloom 系统论证了为什么 Workers 用 V8 Isolates 而非容器/虚拟机：从冷启动、上下文切换、内存占用、计费模型四个维度给出量化对比，并诚实列出 Isolates 无法运行任意编译代码这一硬限制——是「边缘计算」范式的起源文档之一。

## 核心观点

**1. Isolates 与容器的根本差异：进程内隔离 vs 进程隔离**

传统 Serverless（如 Lambda）的隔离单位是**进程**——每个函数调用跑在自己的容器里。Isolates 的隔离单位是 V8 引擎内的**轻量上下文**：一个操作系统进程可以同时运行数百到数千个 Isolate，彼此看不到对方的内存。作者指出这是「真正贴近金属」的形态：没有虚拟化层，只付一次 JS 运行时的开销，之后「几乎可以无限地运行脚本而不产生个体开销」。

关键在于多租户假设的差异：**V8 从设计之初就是为多租户而生**（浏览器的多个标签页跑在同一进程里，互相隔离），而 Node/Python 运行时从来没有这个设计目标。作者认为这个「出身差异」决定了建立在它们之上的多租户系统必然低效。

**2. 冷启动：5 毫秒 vs 500 毫秒到 10 秒**

Lambda 的冷启动要启动一个容器化进程，耗时 500ms-10s；且**一个 Lambda 同时只能处理一个请求**，所以每来一个新并发请求就要再冷启动一次——这个延迟会反复发生。如果函数一段时间没被调用会被关机，下次再来又要重来；每次部署新代码，所有 Lambda 都要重新部署，同样触发冷启动。

Workers 因为不需要启动进程，Isolate 启动约 **5ms**（作者形容为「不可感知」），且扩缩容和部署同速——他认为这从根上消除了 Serverless 的冷启动问题。

**3. 上下文切换与内存：被忽略的成本大头**

操作系统在进程间切换要做 context switch（换出/换入全部内存），每次可耗 **100 微秒**。当一台 Lambda 服务器上跑着大量 Node/Python/Go 进程时，这些切换累积起来意味着 CPU 有相当比例不是在跑用户代码，而是在做切换。Isolate 方案所有代码跑在**单一进程**内、由自己的机制保证内存安全，因此没有这类昂贵切换。

内存差距更直观：**一个不跑任何真实代码的 Node Lambda 就占 35MB**；Isolates 共享运行时后降到约 **3MB**。由于内存往往比 CPU 更贵，「降低一个数量级」直接改变了经济模型。

**4. 安全策略：不自己造隔离层，押注地球上测试最充分的软件**

把多个客户的代码放进同一个进程，安全是首要问题。作者明确说 Cloudflare 没有自己实现隔离层——因为打造一个真正安全的隔离系统所需要的测试、fuzzing、渗透测试和赏金投入是天文数字。他们能这么做的前提只有两个：**V8 是开源的**，且「可能是地球上安全测试最充分的软件」。在此之上 Cloudflare 只加了自己的几层防护（例如针对时序攻击的对策）。这是一个典型的**「把最难的问题押注在已被大规模验证的第三方资产上」**的架构决策。

**5. 计费模型的差异，以及它为什么是 3 倍成本差的来源**

Lambda 按运行时长发计费，**向上取整到最近的 100 毫秒**（平均每次执行多付 50ms）；更关键的是，**它把等待外部请求的时间也算进去**——外部调用动辄数百甚至数千毫秒，规模一大就是「荒谬的金额」。Isolates 因为内存占用足够小，可以只在实际执行代码时计费。

作者给出的对比：一个提供 50ms CPU 的 Worker 是 **$0.50/百万请求**，等效的 Lambda 是 **$1.84/百万请求**。他认为 3 倍的成本差本身就足以驱动企业迁移。

**6. 「网络即计算机」：部署到 155 个数据中心比对手部署到 1 个还便宜**

作者对比 Amazon 的 Lambda@Edge：贵 3 倍、**首次部署要 30 分钟**、不允许任意请求（限制在类 CDN 用途）。而 Isolates 能把每个源文件部署到 155 个数据中心，成本还优于 Amazon 部署到单一区域。他由此推断：「运行 155 个 Isolate 可能比运行单个容器更便宜」——同时也坦承不知道 Amazon 的成本结构，可能只是「按市场承受力定价」。

他还点出一个可靠性论点：Lambda 跑在单个可用区、单个区域、单个数据中心里，而「真正可靠的系统必须部署在地球上不止一个地方」。

**7. 诚实的劣势：不能运行任意编译代码**

作者专设一节讲缺点：**Isolate 系统无法运行任意编译后的二进制**。进程级隔离允许 Lambda 启动任何它需要的二进制文件；在 Isolate 世界里，代码要么用 JavaScript 写（Cloudflare 自己大量用 TypeScript），要么用能编译到 WebAssembly 的语言（Go、Rust）。**如果你无法重新编译你的进程，就无法把它搬进 Isolate**——这意味着短期内 Isolate 形态的 Serverless 只适合较新的应用，既有系统可能只能先把延迟最敏感的部分迁过去。

## 关键引用

> "Any given Isolate can start around a hundred times faster than I can get a Node process to start on my machine. Even more importantly, they consume an order of magnitude less memory than that process."

> "A basic Node Lambda running no real code consumes 35 MB of memory. When you can share the runtime between all of the Isolates as we do, that drops to around 3 MB."

> "Lambdas are billed based on how long they run for. That billing is rounded up to the nearest 100 milliseconds, meaning people are overpaying for an average of 50 milliseconds every execution. Worse, they bill you for the entire time the Lambda is running, even if it's just waiting for an external request to complete."

> "It wouldn't have been productive or efficient for Cloudflare to build that isolation layer ourselves. It takes an astronomical amount of testing, fuzzing, penetration testing, and bounties required to build a truly secure system of that complexity."

> "An Isolate-based system can't run arbitrary compiled code. Process-level isolation allows your Lambda to spin up any binary it might need."

## 来源

- [Cloud Computing without Containers — Zack Bloom, Cloudflare](https://blog.cloudflare.com/cloud-computing-without-containers/)

## Agent 短评

**价值**：这是**架构论证文章的范本**。大多数技术选型文章停留在「我们用了 X」，这篇的骨架是「为什么**不**用主流方案 Y」——而且四个维度（冷启动 / 上下文切换 / 内存 / 计费）每一个都给了具体数字，不是形容词。尤其值得学的是它的论证结构：先定义隔离单位的差异（进程内 vs 进程），再从这个根因推导出所有下游后果。这种「找根因、不列现象」的写法，比结论本身更有迁移价值。

另外它给出了一个可复用的架构原则：**把最难的问题押注在已被大规模验证的第三方资产上**（V8 而非自研隔离层）。这个思路在任何需要「安全隔离」或「高可靠性」的系统里都适用。

**局限（主要是时效性，需重点说明）**：
· **文章写于 2018 年 11 月，已过去近 8 年。** 文中的数据全部过时——「155 个数据中心」、$0.50/百万请求的定价、以及 Workers 当时的功能形态（Durable Objects、R2、D1、Workers AI 等都不存在）。**引用具体数字前必须重新核实。**
· **文章的核心预测只对了一半。** 它说「容器和虚拟机不是云计算的未来」——在**边缘计算**这个细分场景，Isolate 模型确实胜出并被广泛采纳（Deno Deploy、Vercel Edge 等都采用类似模型）；但在**企业通用计算**场景，容器（Kubernetes）至今仍是绝对主流。文章把「边缘的架构约束」外推成了「整个云计算的未来」，这个外推没有兑现。
· **立场需要标明**：作者是 Cloudflare 员工，文章结尾有明确的产品试用引导和招聘信息（"We also need engineers and product managers... please reach out"）。技术论证本身成立（数据可查、劣势也如实写了），但它是**供应商视角的论证**，读者应意识到竞品（Lambda 的冷启动与计费）是被选择性地对比的——例如文中未讨论容器方案在可移植性、生态成熟度和本地开发体验上的优势。

**怎么读**：当作「边缘计算架构」的**起源文档**读，而不是当作现状参考。论证逻辑（多租户隔离的成本结构如何决定架构选择）至今有效且值得反复琢磨；所有具体数字需要更新。如果你的场景是边缘/高并发短时任务，这篇文章的推理链直接适用；如果是通用后端，结论不可照搬。
