# 📚 Wilson's Knowledge Base · 知识花园

> 个人知识库 — 阅读精选 & 开源项目发现，AI 辅助整理，基于 [Quartz v4](https://quartz.jzhao.xyz/) 构建，部署于 Vercel。

**[kb.wilsonhandbook.online](https://kb.wilsonhandbook.online)**

---

## 项目概述

不定期更新的深度技术阅读笔记与开源仓库发现，经 AI 辅助整理为结构化知识。

| 板块 | 内容 | 说明 |
|------|------|------|
| 📖 **阅读列表** | 技术笔记 | AI Agent 工程、Claude Code、Cursor、Perplexity、Linear 等 |
| 📦 **仓库列表** | 开源项目发现 | 记录有趣的开源仓库，按发现时间分组 |
| 🔍 **全文搜索** | FlexSearch 索引 | 客户端全文检索，关键词直达 |
| 🔗 **双向链接** | `[[wikilinks]]` | 笔记间通过链接相互关联，点开即达 |
| 📡 **RSS 订阅** | `/index.xml` | 最近 50 条，全文 HTML，自动更新 |
| 📱 **移动端适配** | 响应式三栏布局 | 桌面/平板/手机自动切换 |

### 技术栈

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
| **RSS** | Quartz ContentIndex emitter |
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

# 死链接检查
lychee --config lychee.toml public/
```

构建输出在 `public/` 目录：

```bash
python3 -m http.server 8080 -d public
```

---

## 项目结构

```
.
├── content/                  # Markdown 源文件
│   ├── index.md              #   首页
│   ├── 阅读列表/             #   阅读笔记
│   │   ├── 2026年03月/       #     按年月分组
│   │   ├── 2026年04月/
│   │   └── 2026年05月/
│   └── 仓库列表/             #   开源项目发现
│       └── 2026年05月/
├── quartz/                   # Quartz 框架源码（v4.5.2）
│   ├── build.ts              #   构建主流程
│   ├── cfg.ts                #   类型定义
│   ├── components/           #   组件
│   │   ├── RSSLink.tsx       #     ← 自定义：RSS 订阅按钮
│   │   ├── SidebarCollapse.tsx  ← 自定义：侧边栏折叠
│   │   ├── scripts/          #   浏览器端 inline 脚本
│   │   └── styles/           #   SCSS 样式
│   │       ├── custom.scss   #     ← 核心自定义样式
│   │       └── rssLink.scss  #     ← RSS 按钮样式
│   ├── plugins/              #   Transformers / Filters / Emitters
│   ├── i18n/                 #   多语言支持（含 zh-CN）
│   └── util/                 #   工具函数
├── quartz.config.ts          # 主配置（站点名、语言、主题、插件）
├── quartz.layout.ts          # 布局配置（三栏 Grid 定义、组件排列）
├── docs/                     # 开发文档 (GitHub Pages 独立站点)
│   ├── index.html            #   系统架构图
│   ├── framework-decision.md #   框架选型决策
│   └── quartz-capability-analysis.md
├── .github/workflows/        # CI 流水线
│   └── links.yml             #   Dead Link Checker
├── lychee.toml               # 死链接检查配置
├── vercel.json               # Vercel 部署配置
└── serve.py                  # 本地预览服务器
```

---

## 架构速览

查看 [开发文档站点](https://wilsonwangdev.github.io/wilson-knowledge-base/) 了解系统架构图、框架选型决策及能力分析。

**核心数据流：**

```
Content (Markdown + Frontmatter)
  │
  ├─ Transformers (解析 wikilink、语法高亮、目录生成)
  ├─ Filters (过滤草稿)
  └─ Emitters (生成 HTML、RSS、Sitemap、OG Image、Tag Pages)
      │
      └─ public/ → Vercel 部署 → kb.wilsonhandbook.online
```

**页面布局：**

```
Desktop:  [Sidebar 320px] [Center auto] [Sidebar 320px]
Tablet:   [Sidebar 320px] [Center auto]
Mobile:   [Header bar] [Content stack]
```

---

## 自定义扩展

| 扩展 | 文件 | 说明 |
|------|------|------|
| **RSS 订阅图标** | `quartz/components/RSSLink.tsx` | 侧边栏 📡 按钮，仅桌面端显示，链接 `/index.xml` |
| **侧边栏折叠** | `quartz/components/SidebarCollapse.tsx` | 桌面端左边缘固定按钮，localStorage 持久化 |
| **板块分组** | `quartz.layout.ts` | 阅读列表 & 仓库列表独立展示，上下篇不跨板块 |
| **Explorer 排序** | `quartz.layout.ts` | 固定板块顺序 + 按日期倒序，中文文件夹名友好 |
| **H5 移动适配** | `quartz/styles/custom.scss` | 触摸优化、边距微调、占用控件精简，非侵入式修改 |
| **暗色模式** | 内置 + custom.scss 增强 | 亮/暗主题切换，CSS 变量驱动 |

---

## 内容规范

### 阅读笔记

```markdown
---
title: "文章标题"
date: 2026-05-23T10:00:00
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

### 仓库发现

```markdown
---
title: "项目名称"
date: 2026-05-25T09:00:00
tags: [tools, knowledge-graph]
---

## 一句话总结

一句话描述项目核心价值。

## 核心能力

- 特性列表...

## 为什么关注

个人评价 / 适用场景。

## 来源

[GitHub: user/repo](https://github.com/user/repo)
```

---

## 许可证

MIT

---

*Created with Quartz v4.5.2 · 自 2026-03 持续维护*
