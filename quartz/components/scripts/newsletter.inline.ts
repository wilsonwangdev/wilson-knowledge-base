// Newsletter form — submit in new tab so follow.it's confirmation flow completes properly
// (follow.it blocks framing via CSP, so neither fetch nor iframe works)
function initNewsletterForm() {
  const forms = document.getElementsByClassName("nl-form") as HTMLCollectionOf<HTMLFormElement>
  for (const form of forms) {
    form.target = "_blank"

    form.addEventListener("submit", () => {
      const input = form.querySelector(".nl-input") as HTMLInputElement
      const msg = form.parentElement?.querySelector(".nl-msg") as HTMLElement

      if (!input?.value.trim()) return

      // Show success message before form navigates to follow.it in new tab
      if (msg) {
        msg.style.display = ""
        msg.textContent = "✅ 已提交，新标签页确认后即完成订阅"
        msg.className = "nl-msg nl-success"
        setTimeout(() => {
          msg.style.display = "none"
        }, 5000)
      }
    })
  }
}

initNewsletterForm()
document.addEventListener("nav", initNewsletterForm)
