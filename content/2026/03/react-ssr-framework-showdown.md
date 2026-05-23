---
title: "React SSR 框架性能大对决：TanStack Start vs React Router vs Next.js"
date: 2026-03-23
tags: [react-ssr, tanstack-start, nextjs, performance-benchmark, nodejs]
---

## 一句话总结

Platformatic 团队用相同电商应用在 AWS EKS 上以 1000 req/s 压测三大 React SSR 框架：TanStack Start 以 13ms 平均延迟夺冠，Next.js v16 canary 改进惊人。

## 核心发现

1. **TanStack Start 是性能之王**：平均 13ms 延迟，比 React Router 吞吐量高 25%、延迟低 35%，在 1000 req/s 下实现 100% 成功率。

2. **Next.js 的救赎**：v15.5.5 在 1000 req/s 下约 40% 请求失败，但升级到 v16.2.0-canary.66 后吞吐量翻倍、延迟降低六倍。

3. **开放基准测试驱动生态改进**：TanStack 团队在 7 个版本内实现 252 倍响应时间改进；React RSC 反序列化的 JSON.parse reviver 修复带来 75% 速度提升。

4. **Watt 运行时加成**：通过 SO_REUSEPORT 在所有框架上提供 7%-38% 的一致性能改善，但框架选择的影响远大于运行时选择。

5. **测试设计**：特意不使用缓存（模拟企业电商因个性化策略和 A/B 测试而避免缓存的真实场景），所有框架分配相同 6 核 CPU。

> "Performance benchmarks capture a moment, not a final judgment."

## 来源

[React SSR Framework Showdown — Platformatic](https://blog.platformatic.dev/react-ssr-framework-benchmark-tanstack-start-react-router-nextjs)
