// Intercept newsletter form submission — submit via fetch so user stays on site
function initNewsletterForm() {
  const forms = document.getElementsByClassName("nl-form") as HTMLCollectionOf<HTMLFormElement>
  for (const form of forms) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const input = form.querySelector(".nl-input") as HTMLInputElement
      const btn = form.querySelector(".nl-btn") as HTMLButtonElement
      const msg = form.parentElement?.querySelector(".nl-msg") as HTMLElement

      if (!input || !btn) return

      const email = input.value.trim()
      if (!email) return

      // Show loading state
      btn.disabled = true
      btn.textContent = "发送中…"

      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `email=${encodeURIComponent(email)}`,
        })

        if (res.ok || res.redirected) {
          input.value = ""
          if (msg) {
            msg.style.display = ""
            msg.textContent = "✅ 订阅成功！请查看邮箱确认。"
            msg.className = "nl-msg nl-success"
          }
        } else {
          throw new Error("Request failed")
        }
      } catch {
        if (msg) {
          msg.style.display = ""
          msg.textContent = "⚠️ 网络问题，请稍后重试"
          msg.className = "nl-msg nl-error"
        }
      }

      btn.disabled = false
      btn.textContent = "订阅"

      // Auto-hide message after 5s
      if (msg) {
        setTimeout(() => {
          msg.style.display = "none"
        }, 5000)
      }
    })
  }
}

initNewsletterForm()
document.addEventListener("nav", initNewsletterForm)
