import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint not-found-page">
      <h1>404</h1>
      <p class="not-found-message">{i18n(cfg.locale).pages.error.notFound}</p>

      <div class="not-found-nav">
        <p class="not-found-hint">试试去这里找：</p>
        <div class="not-found-links">
          <a href={`${baseDir}reading/`} class="not-found-card">
            <span class="not-found-icon">📖</span>
            <span>阅读列表</span>
          </a>
          <a href={`${baseDir}repos/`} class="not-found-card">
            <span class="not-found-icon">📦</span>
            <span>仓库列表</span>
          </a>
          <a href={`${baseDir}books/`} class="not-found-card">
            <span class="not-found-icon">📚</span>
            <span>书籍列表</span>
          </a>
          <a href={`${baseDir}resources/`} class="not-found-card">
            <span class="not-found-icon">🔗</span>
            <span>在线资源</span>
          </a>
        </div>
        <a href={baseDir} class="not-found-home">
          ← 返回首页
        </a>
      </div>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
