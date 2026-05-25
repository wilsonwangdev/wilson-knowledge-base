# 📚 Wilson's Knowledge Base · 知识花园

> AI 辅助整理的技术阅读笔记与开源项目发现，基于 [Quartz v4.5.2](https://quartz.jzhao.xyz/) 构建。

**[🌐 kb.wilsonhandbook.online](https://kb.wilsonhandbook.online)**
&nbsp;|&nbsp;
**[📡 RSS 订阅](https://kb.wilsonhandbook.online/index.xml)**
&nbsp;|&nbsp;
**[📬 邮件订阅](https://kb.wilsonhandbook.online)**
&nbsp;|&nbsp;
**[📖 开发文档](https://wilsonwangdev.github.io/wilson-knowledge-base/)**

---

## 核心能力

| 能力 | 说明 |
|------|------|
| 📖 **阅读笔记** | AI 辅助整理的深度技术文章，按年月分组，结构化格式 |
| 📦 **仓库发现** | 开源项目收录，按发现时间分组，附个人评价 |
| 🔍 **全文搜索** | FlexSearch 客户端索引，中文友好，关键词直达 |
| 🔗 **双向链接** | Obsidian 风格 `[[wikilinks]]`，笔记间交叉引用 |
| 💬 **评论系统** | Giscus 驱动 (GitHub Discussions)，暗色模式适配 |
| 📡 **RSS 订阅** | `/index.xml`，全文 HTML，最近 50 条，锚点 SVG 已清洗 |
| 📬 **邮件订阅** | follow.it 零成本方案，RSS → Email 管道，footer 表单一键订阅 |
| 👁️ **阅读模式** | 桌面端隐藏侧栏，浮动 ✕ 退出，专注长文阅读 |
| 📱 **H5 移动适配** | 触摸优化、排版适配、图谱隐藏、explorer drawer 修复 |
| 🌓 **暗色模式** | CSS 变量驱动，亮/暗切换，giscus 评论联动 |
| 🔗 **死链接检查** | GitHub Actions + lychee，CI 自动检测，杜绝 404 |
| 📝 **开发文档** | GitHub Pages 独立站点，架构图 + 技术决策 + 实现细节 |

---

## 技术栈

| 层面 | 选型 |
|------|------|
| 静态站点 | [Quartz v4.5.2](https://quartz.jzhao.xyz/) |
| 内容格式 | Markdown + YAML Frontmatter + `[[wikilinks]]` |
| UI | Preact SPA (micromorph 路由) |
| 样式 | SCSS (esbuild → lightningcss) + 自维护 custom.scss |
| 语法高亮 | Shiki (github-light/dark) |
| 搜索 | FlexSearch (客户端全文索引) |
| 知识图谱 | D3.js + PixiJS |
| 评论 | Giscus (GitHub Discussions) |
| RSS | Quartz ContentIndex emitter (rssFullHtml + 定制清洗) |
| 部署 | Vercel 香港节点 |
| CI | GitHub Actions (lychee 死链检查) |
| 字体 | Inter + JetBrains Mono 自托管 |

---

## 自定义扩展

Quartz 默认能力之上，本站额外实现了：

| 扩展 | 文件 | 说明 |
|------|------|------|
| **邮件订阅** | `NewsletterFooter.tsx` | footer 上方 inline 表单，POST follow.it API |
| **RSS 清洗** | `contentIndex.tsx` | 剥除锚点 SVG，邮件客户端友好 |
| **阅读模式** | `custom.scss` + `readermode.inline.ts` | 桌面端 opacity 隐藏侧栏 + 浮动退出按钮 |
| **H5 适配** | `custom.scss` | 触摸优化、排版缩小、explorer 溢出修复 |
| **连续阅读** | `PrevNext.tsx` | 板块内上下篇导航，跨板块不互串 |
| **RSS 图标** | `RSSLink.tsx` | 侧边栏工具栏 📡 订阅快捷入口 |
| **关联阅读** | `custom.scss` | Backlinks 去重 + 标题重命名「反向链接 → 关联阅读」 |
| **板块分组** | `quartz.layout.ts` | 阅读列表 & 仓库列表独立展示，Explorer 按日期倒序 |
| **中文本地化** | `zh-CN.ts` | 全站中文 UI（callout 类型名、搜索提示、日期格式等） |
| **部署时间戳** | `Footer.tsx` | 页脚自动显示部署时间（构建时注入） |

详细设计文档见 [开发文档站](https://wilsonwangdev.github.io/wilson-knowledge-base/) → RSS 管线 / 邮件订阅 / 阅读模式 / H5 适配。

---

## 快速开始

```bash
git clone https://github.com/wilsonwangdev/wilson-knowledge-base.git
cd wilson-knowledge-base
npm install               # Node.js ≥ 20

npx quartz build --serve  # 本地开发
npx quartz build          # 仅构建

npm run check             # TypeScript + 格式检查
lychee --config lychee.toml public/  # 死链检查
```

---

## 项目结构

```
.
├── content/                  # Markdown 源文件
│   ├── index.md              # 首页
│   ├── 阅读列表/             # 按年月分组
│   └── 仓库列表/             # 按发现时间分组
├── quartz/
│   ├── components/           # 组件
│   │   ├── NewsletterFooter.tsx  ← 邮件订阅
│   │   ├── RSSLink.tsx           ← RSS 图标
│   │   ├── PrevNext.tsx          ← 连续阅读
│   │   ├── ReaderMode.tsx        ← 阅读模式 (Quartz 内置，CSS 定制)
│   │   └── Footer.tsx            ← 部署时间戳
│   ├── plugins/emitters/
│   │   └── contentIndex.tsx      ← RSS + cleanHtml
│   ├── styles/custom.scss        ← 核心自定义样式
│   └── i18n/locales/zh-CN.ts     ← 中文本地化
├── quartz.config.ts          # 站点配置
├── quartz.layout.ts          # 布局编排
├── docs/                     # 开发文档 (GitHub Pages)
│   ├── index.html            # 系统架构
│   ├── rss-pipeline.html     # RSS 管线
│   ├── email-subscription.html  # 邮件订阅
│   ├── reader-mode.html      # 阅读模式
│   ├── h5-adaptation.html    # H5 适配
│   ├── framework-decision.html  # 框架决策
│   └── quartz-capability-analysis.html  # 能力分析
├── .github/workflows/links.yml  # 死链检查 CI
└── vercel.json               # Vercel 配置
```

---

## 内容规范

### 阅读笔记

```markdown
---
title: "文章标题"
date: 2026-05-23T10:00:00
tags: [agent, infrastructure]
---

## 一句话总结
核心观点一句话概括。

## 关键要点
- 结构化分析...

## 来源
[原文标题](https://original-url.com)

## Agent 总结
AI 辅助整理提炼。
```

### 仓库发现

```markdown
---
title: "项目名称"
date: 2026-05-25T09:00:00
tags: [tools, knowledge-graph]
---

## 一句话总结
项目核心价值。

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
