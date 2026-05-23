import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { byDateAndAlphabetical } from "./PageList"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import style from "./styles/prevNext.scss"

export default (() => {
  const PrevNext: QuartzComponent = ({ allFiles, fileData, displayClass, cfg }: QuartzComponentProps) => {
    // Only show on content pages (not folder/tag pages)
    if (!fileData.dates) return null

    // Sort all files by date descending, filter out folders
    const pages = allFiles
      .filter((f) => f.dates && f.slug !== fileData.slug)
      .sort(byDateAndAlphabetical(cfg))

    // Find current position
    const currentIndex = pages.findIndex((f) => f.slug === fileData.slug)

    // If not found (e.g., folder page), don't render
    if (currentIndex === -1) return null

    const prev = currentIndex > 0 ? pages[currentIndex - 1] : null
    const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

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
