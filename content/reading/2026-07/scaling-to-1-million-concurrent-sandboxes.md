---
title: "Scaling to 1 Million Concurrent Sandboxes in Seconds"
date: 2026-07-06T00:00
tags: [infrastructure, sandbox, scaling, agent, distributed-systems, kubernetes]
aliases:
  - 阅读列表/2026年07月/scaling-to-1-million-concurrent-sandboxes
---

## 一句话总结

Modal 推倒重写沙箱调度平台——去除所有中心化瓶颈，实现百万级并发沙箱、每秒数万创建速率，核心洞察是"强一致性是规模化 Agent 基础设施的最大敌人"。

## 核心观点

**1. Kubernetes 的架构假设在 Agent 规模化面前全盘失效**

K8s 有三大无法回避的扩展瓶颈：调度算法 O(n×p) 且顺序执行；每个 Pod 生命周期产生多次 etcd 写入；每个节点的心跳写入跟 Pod 创建完全无关但仍占 etcd 带宽。AWS EKS 为扩容到数万节点需要重写 etcd、GKE 直接替换 etcd——这些都是对 K8s 架构假设的根本否定。

**2. 旧 Modal 架构重蹈 K8s 覆辙——强一致性 Postgres 为中心协调点**

原来的沙箱控制平面的每一步——创建队列写入、调度分配、worker 绑定——都需要写入 Postgres。O(sandboxes) 次写入无法简单分片。这不是 Modal 写得不好，而是"全局协调 + 强一致性"这个范式本身就撞墙了。

**3. 新架构的核心原则：去中心化 + 最终一致性**

新控制平面没有中心调度器，没有全局状态存储。调度路径缩短为一层负载均衡器直接向 worker 集群创建容器。没有单点瓶颈意味着没有理论上限——实际跑出来的 100 万并发沙箱，全部在 1 分钟内创建完成。

**4. Agent 对基础设施的要求正从"够用"变成"无限"**

强化学习需要百万级并发沙箱做 rollout，Agent 需要应对流量突发。Modal 的判断是：现有的沙箱平台，包括他们自己的旧版，都不是为这个数量级设计的。这个判断也适用于整个 Agent 基础设施层——我们正在跨过一个临界点。

## 关键引用

> "We've removed all central bottlenecks from our control plane so there are no practical scaling limits, and we've optimized every part of container scheduling and startup, simplifying the scheduling path to a layer of load balancers which create containers directly on our worker fleet."

> "Kubernetes can be scaled, but it requires serious work. To run large numbers of nodes, etcd generally must be rewritten or replaced."

## 来源

- [Modal Blog: Scaling to 1 million concurrent sandboxes in seconds](https://modal.com/blog/scaling-to-1-million-concurrent-sandboxes)

## Agent 短评

这篇文章的价值不在于 Modal 的架构方案本身——你没有 100 万沙箱要管——而在于它用生产级案例把 K8s/强一致性范式的天花板讲透了。对于 Agent 基础设施建设而言，一个更重要的隐含推论是：如果你打算让 Agent 自己创建和管理沙箱（self-service sandbox provisioning），那你选的基础设施调度层已经决定了你的上限。用 K8s → 几千并发 → 够大多数场景；Modal 的路径 → 百万级 → 为 Agent-as-a-Service 做的准备。
