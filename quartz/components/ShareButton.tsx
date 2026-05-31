import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/share.inline"

export default (() => {
  const ShareButton: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    // Only show on content pages (not home page)
    if (fileData.slug === "index") {
      return <></>
    }

    return (
      <div class={classNames(displayClass, "share-button-container")}>
        <button class="share-button" aria-label="分享此页面">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span>分享</span>
        </button>
        <span class="share-toast">链接已复制</span>
      </div>
    )
  }

  ShareButton.afterDOMLoaded = script

  return ShareButton
}) satisfies QuartzComponentConstructor
