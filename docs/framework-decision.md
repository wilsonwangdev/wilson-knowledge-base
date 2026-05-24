# 选型分析：Quartz vs 更换框架

> 分析时间：2026-05-23
> 对比基准：Quartz 官网 (quartz.jzhao.xyz) vs 本站 (kb.wilsonhandbook.online)

## 现状对比

| 维度 | Quartz 官网 | 本站 | 差异来源 |
|------|------------|------|---------|
| Quartz 版本 | v4.5.2 | v4.5.2 | 相同 |
| 移动端 Explorer | 原生 absolute 覆盖层，无额外定制 | position:fixed drawer + backdrop-blur + 关闭按钮 | **custom.scss 重写** |
| 移动端 Header | 原生 flex row 布局 | 重写了 sidebar.left 的 flex + padding | **custom.scss 重写** |
| 汉堡按钮 | 原生 24px 图标 | 44x44 触摸目标 + 圆角 + active 态 | **custom.scss 重写** |
| 导航面板动画 | 原生 transition | cubic-bezier 缓动 + box-shadow | **custom.scss 重写** |
| toggleExplorer JS | 原生 Quartz | 注入了 backdrop + closeButton 管理逻辑 | **explorer.inline.ts 修改** |
| 侧边栏折叠 | 无此功能 | SidebarCollapse 自定义组件 | **新增组件** |
| 桌面颜色主题 | Quartz 默认（紫/灰） | 自定义蓝色系 | quartz.config.ts |
| 字体 | Inter + 等宽 | Inter + JetBrains Mono（自托管） | quartz.config.ts |

## 核心发现

**Quartz 官网的 H5 体验好，是因为它没有自定义——用的就是框架原生行为。**

本站的问题不是 Quartz 不行，而是 **custom.scss 过度定制**，在 230 行 CSS 中重写了整个移动端体验，导致：

1. **与框架原生行为冲突**——`position: fixed` vs `absolute`、自定义 backdrop vs 框架的 `lock-scroll`
2. **引入了额外复杂度**——backdrop 元素需要 JS 管理生命周期、close 按钮需要手动插入
3. **打破了 Quartz 的响应式约定**——原生的 `flex: 0 0 34px` 改为 `auto`，改变了框架假设的尺寸

## 选型结论：**继续使用 Quartz，不更换框架**

### 理由

| 评估维度 | Quartz | 替代方案 | 结论 |
|----------|--------|---------|------|
| **知识图谱** | D3.js + PixiJS 原生支持 | Nextra/VitePress/Docusaurus 需要手动实现或插件 | Quartz 胜 |
| **Obsidian 兼容** | `[[wikilinks]]`、反向链接、图谱原生支持 | 需要大量插件或自定义 | Quartz 胜 |
| **构建速度** | ~3s / 22 篇文章 | 其他 SSG 类似 | 持平 |
| **静态输出** | 纯 HTML，零运行时依赖 | Vercel 一键部署 | 持平 |
| **H5 体验** | 原生可用，定制成本中等 | Nextra 等有更好的移动端支持 | 略逊 |
| **社区/生态** | 活跃 (Discord, 2.7k stars) | Nextra/VitePress 生态更大 | 略逊 |
| **迁移成本** | 21 篇内容有 `[[wikilinks]]`、Obsidian 格式 | 需要转换所有链接 + frontmatter | **高** |
| **个人品牌** | Digital garden 定位明确 | 变成普通文档站 | Quartz 更匹配 |

**权衡：** 知识图谱 + Obsidian 兼容性是 Quartz 的核心价值，H5 体验可以通过**减少定制、回归原生**来优化。更换框架会失去这两个核心能力，且迁移成本高。

## 优化计划：回归 Quartz 原生 + 最小化定制

### 第一步：回退 custom.scss 移动端，恢复框架原生行为

**删除的代码：**
- `@media all and ($mobile)` 中的全部自定义（~150 行）
  - 移除 `.sidebar.left` 布局重写
  - 移除 `.explorer .mobile-explorer` 尺寸定制
  - 移除 `.mobile-explorer-backdrop` 全部样式
  - 移除 `.explorer:not(.collapsed) .explorer-content` 的 `position: fixed` 覆盖
  - 移除 `.explorer.collapsed .explorer-content` 的 transform 覆盖
  - 移除 `.mobile-nav-close` 全部样式
  - 移除导航列表项间距定制
  - 移除 `.explorer` 的 `flex: 0 0 auto` 覆盖

**保留的代码：**
- `.graph { display: none !important }` — H5 隐藏图谱（合理）
- `.page-title { display: none }` — H5 隐藏标题节省空间（合理）
- `.center { padding: 0 1rem }` — 内容区呼吸边距（合理）
- `.article-title` 字号调整 — 移动端阅读优化（合理）
- `.breadcrumb-container` 字号调整（合理）
- `overflow-x: hidden` — 防止横向滚动（合理）

### 第二步：回退 explorer.inline.ts，移除自定义 backdrop/close 逻辑

**删除：**
- `mobileBackdrop` / `ensureBackdrop()` / `openMobilePanel()` / `closeMobilePanel()`
- `toggleExplorer` 中的 `isMobileToggle` 分支

**保留：**
- `checkVisibility()` polyfill（兜底兼容）
- `continue` bug fix

### 第三步：恢复主题色与 Quartz 官网一致

**修改 quartz.config.ts：**
- 将蓝色系 (`#2563eb` / `#60a5fa`) 改回 Quartz 默认紫/灰色系，或保持自主蓝色系（仅为视觉差异，不影响 H5 功能）

### 第四步：验证

- 本地构建 + 手机验证 H5 导航是否正常
- 对比 Quartz 官网行为确认一致性
- 确认桌面端 SidebarCollapse 仍正常工作

## 预期效果

| 改进前 | 改进后 |
|--------|--------|
| 230 行自定义移动端 CSS | ~10 行保留必要调整 |
| 自定义 JS backdrop/close 逻辑 | 框架原生 toggle |
| 与 Quartz 行为不一致 | 与 Quartz 官网行为一致 |
| 维护成本高（每次升级可能冲突） | 维护成本低（框架自动处理） |
| 移动端面板有 backdrop + close × | 简洁的原生覆盖层 |

**核心原则：Let Quartz be Quartz。框架的移动端行为是经过验证的——不要重新发明它。**
