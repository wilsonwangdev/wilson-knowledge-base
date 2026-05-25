import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/newsletterFooter.scss"

export default (() => {
  const NewsletterFooter: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "newsletter-footer")}>
        <form
          class="nl-form"
          action="https://api.follow.it/subscription-form/Y05WSVJBV1JDWVBUSnEwUEYxY1A2TnU2MlJsdDRsTVNEWXJUTDA2QkVyWG5qbFRFdHAvNGphZWxQM2p3VFFMdE15MEFKTU1pNURFdkpYRExCMU9JUVNBK2RTSnpXcDlJNUsrdU1Ec1VGd29jd2lCamlJZmg4ZXk0ZE5NM3hNOVV8Zm4yeDQwQUF4QmhyQnpKUmhZM1RCUmlFeHBRSXF1MkY2NlFKdC8yNElldz0=/8"
          method="post"
        >
          <span class="nl-label">📬 新文章通知</span>
          <input
            type="email"
            name="email"
            required
            placeholder="输入邮箱地址"
            class="nl-input"
          />
          <button type="submit" class="nl-btn">订阅</button>
        </form>
      </div>
    )
  }

  NewsletterFooter.css = style
  return NewsletterFooter
}) satisfies QuartzComponentConstructor
