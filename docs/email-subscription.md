# 邮件订阅系统：RSS + follow.it 零成本方案

> 为静态站点添加邮件订阅能力，无需后端、无需数据库、无需维护邮件服务器。

---

## 动机

Wilson's Knowledge Base 是一个基于 Quartz v4 的静态站点，托管在 Vercel。需要让读者可以**通过邮箱接收新文章通知**，同时保持：

- 零运维成本（无服务器、无数据库）
- 站点本身不存储任何用户数据
- 站长可以查看订阅者列表
- 邮件内容干净可读（而非丑陋的 RSS 原文转储）

---

## 架构总览

![邮件订阅系统架构](subscription-architecture.html)

整个系统分为三个管道：

| 管道 | 触发方式 | 说明 |
|------|---------|------|
| **构建管道** | `npx quartz build` | Markdown → HTML + RSS，部署到 Vercel |
| **订阅管道** | 用户主动操作 | 表单 POST / CTA 链接 → follow.it 注册 |
| **推送管道** | follow.it 定时 | 检测 RSS 更新 → 邮件群发 |

---

## 组件说明

### 1. RSS Feed（index.xml）

Quartz 的 `ContentIndex` 插件在构建时生成 RSS：

```ts
// quartz.config.ts
Plugin.ContentIndex({
  enableRSS: true,
  rssLimit: 50,
  rssFullHtml: true,  // 包含完整 HTML 正文
})
```

输出示例：
```xml
<item>
  <title>文章标题</title>
  <link>https://kb.wilsonhandbook.online/...</link>
  <description><![CDATA[ <h2>一句话总结</h2><p>...</p> ]]></description>
  <pubDate>Mon, 25 May 2026 01:00:00 GMT</pubDate>
</item>
```

### 2. NewsletterFooter 组件

所有页面 footer 上方的紧凑 inline 表单：

```
📬 新文章通知 [输入邮箱地址] [订阅]
```

点击订阅 → POST 到 follow.it 的 `/subscription-form` API → 用户即时加入邮件列表。

```tsx
// quartz/components/NewsletterFooter.tsx
<form action="https://api.follow.it/subscription-form/..." method="post">
  <span>📬 新文章通知</span>
  <input type="email" name="email" required placeholder="输入邮箱地址" />
  <button type="submit">订阅</button>
</form>
```

### 3. Footer 链接

页面底部 footer 中与 GitHub、RSS 并列：

```
GitHub · RSS
```

（邮件订阅只保留 NewsletterFooter 一个入口，footer 中不再重复。）

---

## RSS 内容清洗

默认情况下，Quartz 的 `rssFullHtml: true` 会将页面完整 HTML 原样输出到 RSS `<description>` 中。其中包括每个标题后的锚点 SVG：

```html
<a role="anchor" aria-hidden tabindex="-1" ...>
  <svg width="18" height="18" ...>...</svg>
</a>
```

这些 SVG 在邮件客户端中**完全不渲染**，导致邮件内容混乱。修复方法是在 RSS 生成时用正则剥除。

**⚠️ 关键：`cleanHtml` 必须在 `escapeHTML` 之前执行。**

```ts
// quartz/plugins/emitters/contentIndex.tsx

// ★ 定制 — 清洗函数（模块级，在 escapeHTML 之前调用）
const cleanHtml = (html: string): string => {
  return html.replace(/<a\s+role="anchor"[^>]*>.*?<\/a>/g, "")
}

// emit() 中构建 richContent 时
richContent: opts?.rssFullHtml
  ? escapeHTML(cleanHtml(toHtml(tree as Root, { allowDangerousHtml: true })))
  : undefined,
//           ^^^^^^^^  先清洗原始 HTML，再编码
```

### 为什么第一次修复（fc0079c）没生效

```text
修复前流程:
  toHtml() → 原始 HTML  →  escapeHTML()  →  编码后文本  →  cleanHtml() ❌
                       "<a role=..."     "&lt;a role=..."  正则匹配不到

修复后流程 (3f62ec7):
  toHtml() → 原始 HTML  →  cleanHtml()  →  干净 HTML  →  escapeHTML()  ✅
                       anchor 已剥除
```

`escapeHTML` 把 `<` 编码成 `&lt;` 后，正则 `/a\s+role="anchor"/` 不再匹配。HTML 清洗必须在编码前操作原始字符串。

---

## follow.it 后台配置

### 1. 认领 Feed

在 follow.it 后台输入你的 RSS URL：

```
https://kb.wilsonhandbook.online/index.xml
```

follow.it 会要求验证域名所有权——在站点 `<head>` 添加 meta 标签即可：

```html
<meta name="follow.it-verification-code" content="your-code-here" />
```

### 2. 邮件模板

follow.it 会自动将 RSS 的 HTML 内容渲染为邮件。可通过后台自定义：

- 发送时间（立即 / 每日摘要 / 每周摘要）
- 邮件标题模板
- 发件人名称

### 3. 订阅者管理

认领后可查看：
- 完整订阅者邮箱列表
- 订阅/退订时间
- 邮件打开率

---

## 订阅流程图

```
用户浏览站点
    │
    └── 看到 NewsletterFooter 表单 → 填邮箱 → POST follow.it API
                                                    │
                                                    ▼
                                            follow.it 订阅列表
                                                    │
┌───────────────────────────────────────────────────┤
│  站长发布新文章                                     │
│      │                                             │
│      ▼                                             │
│  Quartz build → RSS 更新 → follow.it 检测 ─────────┘
│                                          │
│                                          ▼
│                                    邮件群发给所有订阅者
└───────────────────────────────────────────────────┘
```

---

## 关键决策记录

| 决策 | 选择 | 原因 |
|------|------|------|
| 邮件服务 | follow.it | 免费、支持 RSS 触发、自带订阅管理 |
| 订阅形式 | inline 表单（非弹窗） | 简洁、无侵入、符合站点定位 |
| RSS HTML 清洗 | 正则剥除锚点 SVG | 最小改动、不影响站点渲染 |
| 域名验证 | meta 标签 | 比上传文件更易维护 |
| 明暗主题 | CSS 变量自适应 | follow.it 表单透明背景继承站点主题 |

---

## 文件清单

| 文件 | 作用 |
|------|------|
| `quartz/components/NewsletterFooter.tsx` | footer 上方 inline 订阅表单（唯一订阅入口） |
| `quartz/components/styles/newsletterFooter.scss` | 表单样式（明暗自适应） |
| `quartz/plugins/emitters/contentIndex.tsx` | RSS 生成 + cleanHtml 清洗 |
| `quartz/components/Head.tsx` | follow.it 验证 meta 标签 |
| `quartz.layout.ts` | 组件布局注册 |
| `docs/subscription-architecture.html` | 架构图 |
| `docs/rss-pipeline.html` | RSS 管线详解 |
