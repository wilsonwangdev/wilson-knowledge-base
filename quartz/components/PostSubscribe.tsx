import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/postSubscribe.scss"

export default (() => {
  const PostSubscribe: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <p class={classNames(displayClass, "post-subscribe")}>
        喜欢这篇文章？{" "}
        <a href="https://follow.it/wilson-s-knowledge-base?leanpub" target="_blank" rel="noopener">
          📬 邮件订阅
        </a>
        ，新文章自动送达。
      </p>
    )
  }

  PostSubscribe.css = style
  return PostSubscribe
}) satisfies QuartzComponentConstructor
