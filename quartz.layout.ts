import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "阅读列表",
        limit: 25,
        filter: (f: any) => f.slug?.startsWith("阅读列表/"),
        showTags: false,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "仓库列表",
        limit: 10,
        filter: (f: any) =>
          f.slug?.startsWith("仓库列表/") && f.slug !== "仓库列表",
        showTags: false,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.PrevNext(),
      condition: (page) => page.fileData.slug?.startsWith("阅读列表/"),
    }),
    Component.ConditionalRender({
      component: Component.Comments({
        provider: "giscus",
        options: {
          repo: "wilsonwangdev/wilson-knowledge-base",
          repoId: "R_kgDOSlyUHA",
          category: "General",
          categoryId: "DIC_kwDOSlyUHM4C9vfI",
          mapping: "pathname",
          lang: "zh-CN",
          reactionsEnabled: true,
          inputPosition: "bottom",
          lightTheme: "light",
          darkTheme: "transparent_dark",
        },
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    // Email subscription — homepage only
    Component.ConditionalRender({
      component: Component.NewsletterSignup(),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/wilsonwangdev/wilson-knowledge-base",
      RSS: "/index.xml",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({ rootName: "首页" }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.DesktopOnly(Component.RSSLink()) },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        // Folders before files
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        // Top-level folders: fixed order
        const order = ["阅读列表", "仓库列表"]
        if (a.isFolder && b.isFolder) {
          const aIdx = order.indexOf(a.displayName)
          const bIdx = order.indexOf(b.displayName)
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
          if (aIdx !== -1) return -1
          if (bIdx !== -1) return 1
          // Both folders: reverse chronological (newest first)
          return b.displayName.localeCompare(a.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }
        // Both files: sort by date, newest first
        const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
        const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
        if (bDate !== aDate) return bDate - aDate
        // Fallback: alphabetical
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [
    // Homepage: show global graph (depth=-1) since index has no wikilinks
    Component.ConditionalRender({
      component: Component.Graph({ localGraph: { depth: -1 } }),
      condition: (page) => page.fileData.slug === "index",
    }),
    // Article pages: standard local graph (depth=1)
    Component.ConditionalRender({
      component: Component.Graph(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs({ rootName: "首页" }), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.DesktopOnly(Component.RSSLink()) },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        // Both folders: reverse chronological (newest first)
        if (a.isFolder && b.isFolder) {
          return b.displayName.localeCompare(a.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }
        const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
        const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
        if (bDate !== aDate) return bDate - aDate
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [],
}
