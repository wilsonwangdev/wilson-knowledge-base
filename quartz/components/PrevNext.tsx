import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { byDateAndAlphabetical } from "./PageList"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import style from "./styles/prevNext.scss"

export default (() => {
  const PrevNext: QuartzComponent = ({ allFiles, fileData, displayClass, cfg }: QuartzComponentProps) => {
    // Sort all content pages with dates, excluding index and folder pages.
    // Filter to only include pages from the same top-level section (阅读列表, 仓库列表, etc.)
    // to prevent PrevNext from crossing section boundaries.
    const sectionPrefix = fileData.slug?.split("/")[0]
    const pages = allFiles
      .filter(
        (f) =>
          f.dates &&
          f.slug !== "index" &&
          !f.slug?.startsWith("tags/") &&
          f.slug?.startsWith(sectionPrefix + "/"),
      )
      .sort(byDateAndAlphabetical(cfg))

    // Find current position in sorted list
    const currentIndex = pages.findIndex((f) => f.slug === fileData.slug)

    // If not found (e.g., folder page or index), don't render
    if (currentIndex === -1) return null

    // With descending sort (newest first), pages[currentIndex - 1] is NEWER
    // and pages[currentIndex + 1] is OLDER. Swap so that:
    //   "上一篇" (prev) → older article   "下一篇" (next) → newer article
    const prev = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null
    const next = currentIndex > 0 ? pages[currentIndex - 1] : null

    // Don't render if at both ends (e.g., single article)
    if (!prev && !next) return null

    return (
      <nav class={classNames(displayClass, "prev-next")}>
        <hr />
        <div class="prev-next-links">
          {prev ? (
            <a
              href={resolveRelative(fileData.slug!, prev.slug! as FullSlug)}
              class="prev-link"
              title={prev.frontmatter?.title}
            >
              <span class="direction">← {i18n(cfg.locale).components.prevNext?.prev ?? "上一篇"}</span>
              <span class="title">{prev.frontmatter?.title}</span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              href={resolveRelative(fileData.slug!, next.slug! as FullSlug)}
              class="next-link"
              title={next.frontmatter?.title}
            >
              <span class="direction">{i18n(cfg.locale).components.prevNext?.next ?? "下一篇"} →</span>
              <span class="title">{next.frontmatter?.title}</span>
            </a>
          ) : (
            <span />
          )}
        </div>
      </nav>
    )
  }

  PrevNext.css = style
  return PrevNext
}) satisfies QuartzComponentConstructor
