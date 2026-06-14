import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "📚 Wilson's Knowledge Base",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "kb.wilsonhandbook.online",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#fafafa",
          lightgray: "#e5e7eb",
          gray: "#9ca3af",
          darkgray: "#374151",
          dark: "#111827",
          secondary: "#2563eb",
          tertiary: "#3b82f6",
          highlight: "rgba(37, 99, 235, 0.1)",
          textHighlight: "#fef08a88",
        },
        darkMode: {
          light: "#0f172a",
          lightgray: "#1e293b",
          gray: "#475569",
          darkgray: "#cbd5e1",
          dark: "#f8fafc",
          secondary: "#60a5fa",
          tertiary: "#93c5fd",
          highlight: "rgba(96, 165, 250, 0.15)",
          textHighlight: "#854d0e88",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({
        sort: (a, b) => {
          // Detect folder entries (month subfolders like "reading/2026-05/index").
          // Folders: sort by title/display name (reverse chronological — newest month first).
          // Files: sort by date (reverse chronological — newest article first).
          const aSlug = (a as any).slug as string
          const bSlug = (b as any).slug as string
          const aIsFolder = aSlug?.endsWith("/index")
          const bIsFolder = bSlug?.endsWith("/index")

          if (aIsFolder && bIsFolder) {
            const aName = (a as any).frontmatter?.title || ""
            const bName = (b as any).frontmatter?.title || ""
            return bName.localeCompare(aName, undefined, { numeric: true, sensitivity: "base" })
          }
          if (aIsFolder && !bIsFolder) return -1
          if (!aIsFolder && bIsFolder) return 1

          // Both files: sort by date (newest first)
          const getDate = (x: any): number => {
            if (x.dates?.created) return new Date(x.dates.created).getTime()
            if (x.date) return new Date(x.date).getTime()
            if (x.frontmatter?.date) return new Date(x.frontmatter.date).getTime()
            return 0
          }
          return getDate(b) - getDate(a)
        },
      }),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssLimit: 50,
        rssFullHtml: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
