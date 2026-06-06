---
title: "Agent Readability Spec"
date: 2026-06-06
tags: [resource, agent-infra, web-standards, seo]
---

## 一句话总结

Vercel 官方发布的 AI Agent 友好网站规范，覆盖三个层次：Discovery（`llms.txt`、sitemap）、Structure（meta tags、headings、JSON-LD）、Context（markdown mirrors、AGENTS.md），附可验证的实操 checklist。

## 为什么关注

在已有的 Agent 资料中，大多是讲 agent 怎么工作（harness engineering、prompt 设计），这篇反过来——讲网站怎么让 agent 读懂自己。给出的三层模型（发现→解析→理解）清晰实用，每个要求有具体的 what / why / how to verify。特别值得关注的是 `llms.txt` 的引入——这和 `robots.txt` / `sitemap.xml` 形成一个完整的 agent 可发现性栈。对于同时在维护多个面向 agent 站点的开发者来说，这是一份可以直接对着改的清单。

## 来源

- [Agent Readability: A Specification for AI-Optimized Websites](https://vercel.com/kb/guide/agent-readability-spec)
