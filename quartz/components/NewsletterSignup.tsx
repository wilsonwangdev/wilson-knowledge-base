import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/newsletter.scss"

const NEWSLETTER_HTML = `
<div class="followit--follow-form-container" attr-a attr-b attr-c attr-d attr-e attr-f>
  <form action="https://api.follow.it/subscription-form/Y05WSVJBV1JDWVBUSnEwUEYxY1A2TnU2MlJsdDRsTVNEWXJUTDA2QkVyWG5qbFRFdHAvNGphZWxQM2p3VFFMdE15MEFKTU1pNURFdkpYRExCMU9JUVNBK2RTSnpXcDlJNUsrdU1Ec1VGd29jd2lCamlJZmg4ZXk0ZE5NM3hNOVV8Zm4yeDQwQUF4QmhyQnpKUmhZM1RCUmlFeHBRSXF1MkY2NlFKdC8yNElldz0=/8" method="post">
    <div class="form-preview">
      <div class="preview-heading">
        <h5>通过邮件接收新文章</h5>
      </div>
      <div class="preview-input-field">
        <input type="email" name="email" required="" placeholder="输入邮箱地址" spellcheck="false">
      </div>
      <div class="preview-submit-button">
        <button type="submit">订阅</button>
      </div>
    </div>
  </form>
  <a href="https://follow.it" class="powered-by-line">Powered by <img src="https://follow.it/images/colored-logo.svg" alt="follow.it" height="17px"/></a>
</div>
`

export default (() => {
  const NewsletterSignup: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "newsletter-signup")}>
        <h3>📬 邮件订阅</h3>
        <div dangerouslySetInnerHTML={{ __html: NEWSLETTER_HTML }}></div>
      </div>
    )
  }

  NewsletterSignup.css = style
  return NewsletterSignup
}) satisfies QuartzComponentConstructor
