---
title: "The Problem With MCP: Stateful Servers"
date: 2026-07-06T18:00
tags: [mcp, architecture, stateful, serverless, sse]
aliases:
  - 阅读列表/2026年07月/the-problem-with-mcp-stateful-server
---

## 一句话总结

Matt Pocock 拆解 MCP SSE 传输层的根本架构问题——服务端天然有状态，导致无法部署到 Serverless 环境，并提出 Redis 外存状态的解决方案。

## 核心观点

**1. MCP SSE 传输层是单客户端的**

SSEServerTransport 被保存在单个变量中，第二个客户端连接时第一个会被断开。这不是实现 bug，是 SSE 协议本身的设计约束——服务端需要维持一个长连接来推送事件。

**2. 有状态 = 与 Serverless 不兼容**

即使通过 ID 路由解决多客户端问题，transport 仍存在于进程内存中。Vercel、AWS Lambda 等 Serverless 平台在请求之间会销毁内存状态，这意味着 MCP Server 只能部署在 VPS 这类长驻进程中。

**3. Redis 外存是可行的生产方案**

将 transport 状态存入 Redis 等 KV 存储后，服务进程本身变成无状态的，可以部署到 Serverless。Vercel 的 `mcp-on-vercel` 仓库已有参考实现，且可适配到任何 Serverless 平台。

**4. 协议层面的开放问题**

Pocock 最后追问：这个"需要外挂数据库才能 Serverless 部署"的架构，是否意味着协议本身设计时就该考虑无状态？客户端能不能自己持有状态？这是对 MCP 协议设计哲学的挑战，不是工程修补。

## 关键引用

> "MCP servers are stateful by nature. But by storing the state in a database, we can deploy them to serverless environments."

> "was there a way of designing this protocol so that the service could be stateless? Having to hook up a key-value store feels like more overhead than necessary."

## 来源

- [The Problem With MCP: Stateful Servers — AIHero](https://www.aihero.dev/the-problem-with-mcp-stateful-server)

## Agent 短评

这是 MCP 教程系列中难得的一篇架构批判而非使用指南。Pocock 没有停留在"这样做就能跑"，而是追问"这个设计本身是不是有更好的选择"。对于正在将 MCP Server 推向生产环境的开发者，这篇的价值不在 Redis 方案本身，而在它迫使思考一个问题：当一个协议的基础传输原语就排斥 Serverless 时，外挂状态存储是解药还是创可贴。
