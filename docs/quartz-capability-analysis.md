# Quartz 能力边界分析

> 分析时间：2026-05-23
> 版本：Quartz v4.5.2

## 框架定位

Quartz 是一个**静态站点生成器**，专为 Obsidian-style digital garden 设计。它的核心假设是：

1. 内容是 Markdown 文件，放在 `content/` 目录
2. 内容通过 Obsidian 风格的 `[[wikilinks]]` 相互关联
3. 输出是纯静态 HTML+CSS+JS，零服务端运行时

**本质上是一个「编译型」系统**——所有逻辑在构建时完成，浏览器端只有少量交互增强。

---

## 能力矩阵

### ✅ Quartz 原生支持（无需修改框架）

| 能力 | 实现方式 | 说明 |
|------|----------|------|
| Markdown → HTML | remark/rehype 管道 | 12 种 transformer 插件可用 |
| 语法高亮 | Shiki (构建时) | 双主题 (light/dark) |
| 全文搜索 | FlexSearch (客户端) | ~2MB 搜索索引，在 postscript.js 中 |
| 知识图谱 | D3.js + PixiJS | Canvas/WebGL 渲染，桌面端默认 |
| 暗色模式 | CSS 变量切换 | `<html saved-theme>` 属性驱动 |
| 阅读模式 | CSS opacity | 切换侧边栏透明度 |
| 目录 (TOC) | 构建时生成 | 右侧栏 sticky 导航 |
| 反向链接 | 构建时计算 | 右侧栏 Backlinks 组件 |
| RSS / Sitemap | 构建时生成 | 自动更新 |
| OG 图片 | Satori (构建时渲染) | 每篇文章独立社交预览图 |
| Popover 预览 | 客户端 JS | 悬停 wikilink 弹出预览卡片 |
| SPA 导航 | micromorph | 页面间无刷新切换 |
| 评论 | Giscus | GitHub Discussions 集成 |
| 数学公式 | KaTeX / MathJax | 构建时 + 客户端渲染 |

### 🟡 可定制（需修改 quartz 配置或 custom.scss）

| 能力 | 当前状态 | 限制 |
|------|----------|------|
| 布局排列 | 三栏 Grid，通过 `quartz.layout.ts` 配置 | 只能控制组件**排列顺序**，不能改变 Grid 结构本身（除非改 `base.scss`） |
| 侧边栏折叠 | **已实现** (SidebarCollapse + custom.scss) | 通过修改 `grid-template-columns` 实现，不是真正的侧滑动画 |
| 移动端响应式 | **已深度定制** (custom.scss ~230 行) | Quartz 原生的移动端体验很差——只是简单的 column stack |
| Explorer 排序 | 通过 sortFn 配置 | 只能控制排序，不能改变渲染结构 |
| 字体 | 自托管 (local) | 需要手动将字体文件放到 `quartz/static/` |
| 颜色主题 | `quartz.config.ts` 中的 `theme` | 有限的 CSS 变量覆盖——不是完整的主题系统 |
| 国际化 | 30 种 locale 文件 | 字符串级别的 i18n，需要手动维护 `zh-CN.ts` |

### 🔴 Quartz 的硬限制（框架架构决定的）

| 限制 | 原因 | 影响 |
|------|------|------|
| **无真正的客户端路由** | micromorph 是 DOM 替换，不是 React Router 式 SPA | 无法在 JS 中访问路由状态、无法实现条件渲染 |
| **无状态管理** | 纯静态 HTML，无共享状态 | localStorage 是唯一持久化手段；组件间状态隔离 |
| **CSS 全局作用域** | SCSS，无 CSS-in-JS/CSS Modules | 所有样式在全局命名空间，需小心特异性冲突 |
| **无组件间通信** | TSX 组件在构建时渲染为静态 HTML | 组件间无法互相引用或传递数据——除了 DOM 事件 |
| **JS 体积大** | postscript.js 724KB | 包含 D3 + PixiJS + FlexSearch + 所有 inline 脚本 |
| **构建时耦合** | 所有逻辑在 `npx quartz build` 时确定 | 动态内容（如实时数据）完全不可能 |
| **无服务端能力** | 纯静态输出 | 无 API 路由、无 serverless function、无中间件 |
| **Monorepo 不友好** | 强假设 content/ 是本地目录 | 无法从外部数据源拉取内容（除非写自定义 emitter） |
| **Extremely opinionated DOM** | 生成的 HTML 结构不可控 | 无法自定义组件输出的 DOM 结构——只能通过 CSS 覆盖 |

---

## 当前踩到的框架限制

### 1. 移动端 Navigation 体验

**问题：** Quartz 原生的 mobile explorer 只是一个 `position: absolute` 的全屏覆盖层，无 backdrop、无动画、无关闭交互。

**当前方案：** 在 `custom.scss` 中用 ~230 行 CSS 重写了整个移动端体验——drawer 面板、backdrop-blur 遮罩、关闭按钮。在 `explorer.inline.ts` 中注入了 backdrop 管理和关闭逻辑。

**仍然是 hack：** 框架不提供「navigation drawer」作为一等概念，我们是通过覆盖 `.explorer:not(.collapsed) .explorer-content` 的 `position: absolute` → `position: fixed` 来实现的。这在 SPA 导航后需要手动管理 DOM 状态。

### 2. 侧边栏折叠 = Grid 列宽变化

**问题：** 折叠侧边栏通过 `grid-template-columns: 0 1fr $sidePanelWidth` 实现。这不是「折叠」而是「删除列」——内容区域会突然左移，无平滑过渡。

**当前方案：** 添加了 `transition` 和 `padding-left` 补偿。但 `grid-template-columns` 的过渡在大多数浏览器中不平滑。

**更好的方案（不可行）：** 理想的侧边栏折叠应该是 `transform: translateX(-320px)` 让侧边栏滑出，同时内容区自然扩展。但 Quartz 的 grid 布局和 sticky 定位阻止了这种实现。

### 3. 组件无法互操作

**问题：** `SidebarCollapse` 组件和 `ReaderMode` 组件独立工作，互不知晓。当两者同时激活时，UI 可能出现不一致。

**当前方案：** 无。——两个组件各自管理自己的 CSS class / attribute，没有协调机制。

**影响：** 未来如果要添加更多交互式组件（如键盘快捷键、手势），需要小心状态冲突。

### 4. 无原生触摸手势支持

**问题：** Quartz 没有任何 swipe/gesture 处理。移动端 drawer 只能通过点击打开/关闭。

**改进方向：** 可以在 `explorer.inline.ts` 中添加 `touchstart`/`touchend` 事件处理 swipe-to-close。但需要小心和页面滚动冲突。

### 5. 性能：724KB JS Bundle

**问题：** 即使只访问一篇文章，浏览器也需要加载完整的 724KB JS（包含 D3、PixiJS、FlexSearch）。

**框架原因：** Quartz 将所有 inline 脚本和依赖打包到一个 `postscript.js`。没有代码分割、没有懒加载。

**改进方向：** 理论上可以通过修改 `build.ts` 中的 esbuild 配置来做 code splitting，但框架没有提供这种 hook。

---

## 关于 H5 UX 的改进策略

基于以上分析：

| 可行的改进 | 实现方式 |
|-----------|----------|
| Swipe-to-close drawer | `explorer.inline.ts` 加 `touchstart`/`touchend` 监听 |
| 更平滑的面板过渡 | `custom.scss` 调整 cubic-bezier + transition duration |
| 暗色模式下面板颜色 | `custom.scss` 用 `[saved-theme=dark]` 选择器 |
| 键盘快捷键 (Esc 关闭) | `explorer.inline.ts` 加 `keydown` 监听 |
| Haptic 反馈 | `navigator.vibrate` (需要用户手势触发) |

| 不可行或高成本的改进 | 原因 |
|---------------------|------|
| 真正的 React/Vue 组件系统 | Quartz 是编译型 SSG，不是 CSR 框架 |
| 侧边栏 slide-out 动画 | Grid 布局限制，需要改 `base.scss` 核心布局 |
| 代码分割 / 按需加载 | esbuild 配置被框架封装，无 hook 点 |
| 服务端渲染的动态内容 | 无服务端运行时 |

---

## 结论

Quartz 是一个**优秀的 digital garden 框架**——对于以内容为中心、构建时确定的静态知识库，它的插件系统和 Markdown 处理能力很强。

但在**交互体验**方面，它提供的只是一个「基线」——所有高级交互（drawer 面板、手势、过渡动画）都需要通过 CSS 覆盖和内联脚本手工实现，而且受限于框架的 DOM 结构和构建流程。

**核心策略：拥抱 custom.scss + inline scripts，不要试图从框架层面突破。**
