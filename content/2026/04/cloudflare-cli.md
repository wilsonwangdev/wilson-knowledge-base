---
title: "Cloudflare CLI 设计"
date: 2026-04-14
tags: [cli, cloudflare, developer-tools]

---

## 一句话总结

Cloudflare 用 TypeScript Schema 替代 OpenAPI 作为 100+ 产品、3000 个 API 的统一接口定义源，自动生成 CLI/SDK/Terraform/MCP/Docs，并内置 Local Explorer 让 Agent 在本地内省模拟资源。

## 背景

Cloudflare 100+ 产品、近 3,000 个 HTTP API 操作。AI 编码 Agent 逐渐成为 API 主要消费者，各接口一致性至关重要。

## 核心设计：TypeScript Schema 替代 OpenAPI

OpenAPI 只能描述 REST API。Cloudflare 引入 TypeScript Schema 作为统一接口定义源，从中自动生成 CLI/SDK/Terraform/MCP/Docs。一组带 lint 和 guardrail 的 TypeScript 类型约定。

## 一致性规则

- 始终用 `get`，绝不用 `info`
- 始终用 `--force`，绝不用 `--skip-confirmations`
- 始终用 `--json`，所有命令统一支持
- 明确标识本地 vs 远程资源

## Local Explorer

公开测试功能，本地开发时内省 Worker 绑定的模拟资源。通过 `--local` 标志，CLI 命令无缝切换至本地 API 镜像。Agent 可直接交互。

安装：`npx cf` 或 `npm install -g cf`

## 来源

[Building a CLI for All of Cloudflare — Cloudflare Blog](https://blog.cloudflare.com/cf-cli-local-explorer/)
