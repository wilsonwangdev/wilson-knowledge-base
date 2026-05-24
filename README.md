# 📚 Wilson's Knowledge Base · 知识花园

> 个人知识库 — AI 辅助整理的深度技术阅读笔记，基于 [Quartz v4](https://quartz.jzhao.xyz/) 构建，部署于 Vercel。

**[kb.wilsonhandbook.online](https://kb.wilsonhandbook.online)**

---

## 项目概述

这里是我每日阅读、思考和整理的个人知识库。每一条笔记都源于日常遇到的链接、文章和想法，经过 AI 辅助整理后沉淀为结构化知识。

- **21 篇** 中文技术笔记，覆盖 AI Agent 工程、Claude Code、Cursor、Perplexity、Linear 等主题
- **50+ 个标签**，通过 `[[wikilinks]]` 建立内部知识关联
- **Quartz v4.5.2** 静态站点生成器，三栏响应式布局
- **Vercel 部署**，中国可访问（香港节点，自托管字体）

---

## 技术栈

| 层面 | 技术选型 |
|------|----------|
| **静态站点生成** | [Quartz v4.5.2](https://quartz.jzhao.xyz/) |
| **内容格式** | Markdown + YAML Frontmatter + `[[wikilinks]]` |
| **UI 框架** | Preact (SPA 路由 via micromorph) |
| **样式** | SCSS (esbuild-sass-plugin → lightningcss 压缩) |
| **语法高亮** | Shiki (github-light/dark 双主题) |
| **搜索** | FlexSearch (客户端全文索引) |
| **知识图谱** | D3.js + PixiJS (WebGL/Canvas 渲染) |
| **图表** | Mermaid (客户端渲染) |
| **数学公式** | KaTeX |
| **评论** | Giscus (GitHub Discussions) |
| **OG 图片** | Satori (服务端 SVG → PNG) |
| **部署** | Vercel (Hobby plan, 香港节点) |
| **CI** | GitHub Actions (Dead Link Checker via lychee) |
| **字体** | Inter + JetBrains Mono (自托管, 无 Google Fonts) |

---

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/wilsonwangdev/wilson-knowledge-base.git
cd wilson-knowledge-base

# 安装依赖 (需要 Node.js ≥ 20)
npm install

# 本地开发
npx quartz build --serve

# 仅构建
npx quartz build

# 运行检查
npm run check       # TypeScript 类型检查 + Prettier 格式检查
npm run format      # 自动格式化

# 运行测试
npm test

# 死链接检查
lychee --config lychee.toml public/
```

构建输出在 `public/` 目录，直接用任意 HTTP 服务器托管即可：

```bash
python3 -m http.server 8080 -d public
```

---

## 项目结构

```
.
├── content/                  # Markdown 源文件（YYYY/MM/ 分层）
│   ├── index.md              #   首页
│   ├── 2026/03/              #   10 篇文章
│   ├── 2026/04/              #   4 篇文章
│   └── 2026/05/              #   7 篇文章
├── quartz/                   # Quartz 框架源码（v4.5.2）
│   ├── build.ts              #   构建主流程
│   ├── cfg.ts                #   类型定义
│   ├── components/           #   33 个 TSX 组件
│   │   ├── SidebarCollapse.tsx   ← 自定义组件
│   │   ├── scripts/          #   15 个浏览器端 inline 脚本
│   │   └── styles/           #   18 个 SCSS 文件
│   ├── plugins/              #   Transformers / Filters / Emitters
│   ├── styles/               #   全局样式
│   │   └── custom.scss       ← 核心自定义（345 行）
│   ├── i18n/                 #   30 种语言（含 zh-CN）
│   ├── processors/           #   构建管道阶段
│   └── util/                 #   工具函数
├── quartz.config.ts          # 主配置（站点名、语言、主题、插件）
├── quartz.layout.ts          # 布局配置（三栏 Grid 定义、组件排列）
├── architecture.html         # 系统架构图（在浏览器中打开）
├── .github/workflows/        # CI 流水线
│   └── links.yml             #   Dead Link Checker
├── lychee.toml               # 死链接检查配置
├── vercel.json               # Vercel 部署配置
└── serve.py                  # 本地预览服务器
```

---

## 架构速览

打开 [`architecture.html`](./architecture.html) 查看完整的系统架构图。

**核心数据流：**

```
Content (Markdown + Frontmatter)
  │
  ├─ Transformers (解析 wikilink、语法高亮、目录生成)
  ├─ Filters (过滤草稿)
  └─ Emitters (生成 HTML、RSS、Sitemap、OG Image、Tag Pages)
      │
      └─ public/ (134 个静态文件)
          │
          └─ Vercel 部署 → kb.wilsonhandbook.online
```

**页面布局：**

```
Desktop:  [Sidebar 320px] [Center auto] [Sidebar 320px]
Tablet:   [Sidebar 320px] [Center auto]
Mobile:   [Header bar] [Content stack] [Right content]
```

---

## 自定义扩展

| 扩展 | 文件 | 说明 |
|------|------|------|
| **侧边栏折叠** | `quartz/components/SidebarCollapse.tsx` | 桌面端左边缘固定按钮，localStorage 持久化 |
| **H5 Drawer 导航** | `quartz/styles/custom.scss` | 移动端侧滑面板 + 毛玻璃遮罩 + 44px 触摸目标 |
| **暗色模式** | 内置 + custom.scss 增强 | 亮/暗主题切换，CSS 变量驱动 |
| **连续阅读** | PrevNext 组件 | 文章底部上一篇/下一篇，按日期排序 |
| **Explorer 排序** | `quartz.layout.ts` | 按日期倒序，文件夹优先 |

---

## 内容规范

每篇文章遵循统一结构：

```markdown
---
title: "文章标题"
date: 2026-05-23
tags: [agent, infrastructure, vercel]
---

## 一句话总结

核心观点用一句话概括。

## 关键要点

- 结构化分析...

## 来源

[原文标题](https://original-url.com)

## Agent 总结

AI 辅助整理的提炼。
```

---

## 许可证

MIT

---

*Created with Quartz v4.5.2 · 自 2026-05 持续维护*
