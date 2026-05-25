import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import styles from "./styles/rssLink.scss"

function RSSLink({ cfg }: QuartzComponentProps) {
  const feedUrl = `https://${cfg.baseUrl}/index.xml`
  return (
    <a href={feedUrl} target="_blank" class="rss-link" title="RSS 订阅" aria-label="RSS 订阅">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
      </svg>
    </a>
  )
}

RSSLink.css = styles

export default (() => RSSLink) satisfies QuartzComponentConstructor
