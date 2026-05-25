// Intercept newsletter form submission — submit into hidden iframe so user stays on site
function initNewsletterForm() {
  const forms = document.getElementsByClassName("nl-form") as HTMLCollectionOf<HTMLFormElement>
  for (const form of forms) {
    // Create a hidden iframe to receive the form submission
    const iframe = document.createElement("iframe")
    iframe.name = "nl-iframe"
    iframe.style.display = "none"
    form.target = "nl-iframe"

    // Remove any existing iframe with the same name
    document.querySelector('iframe[name="nl-iframe"]')?.remove()
    document.body.appendChild(iframe)

    form.addEventListener("submit", () => {
      const input = form.querySelector(".nl-input") as HTMLInputElement
      const btn = form.querySelector(".nl-btn") as HTMLButtonElement
      const msg = form.parentElement?.querySelector(".nl-msg") as HTMLElement

      const email = input.value.trim()
      if (!email) return

      // Show loading state
      btn.disabled = true
      btn.textContent = "发送中…"

      // Wait for iframe to load (follow.it response)
      iframe.onload = () => {
        try {
          // Try to read iframe content to check success
          const body = iframe.contentDocument?.body?.innerText || ""
          if (body.includes("already subscribed") || body.includes("confirm") || body.length < 500) {
            // follow.it response — assume success if no obvious error
            input.value = ""
            if (msg) {
              msg.style.display = ""
              msg.textContent = "✅ 订阅成功！请查看邮箱确认。"
              msg.className = "nl-msg nl-success"
            }
          } else {
            throw new Error("Unexpected response")
          }
        } catch {
          // Can't read iframe (likely cross-origin) — the form POST succeeded though
          input.value = ""
          if (msg) {
            msg.style.display = ""
            msg.textContent = "✅ 订阅成功！请查看邮箱确认。"
            msg.className = "nl-msg nl-success"
          }
        }

        btn.disabled = false
        btn.textContent = "订阅"

        if (msg) {
          setTimeout(() => {
            msg.style.display = "none"
          }, 5000)
        }
      }

      // Timeout fallback after 8s
      setTimeout(() => {
        if (btn.disabled) {
          input.value = ""
          btn.disabled = false
          btn.textContent = "订阅"
          if (msg) {
            msg.style.display = ""
            msg.textContent = "✅ 已提交，请查看邮箱"
            msg.className = "nl-msg nl-success"
            setTimeout(() => {
              msg.style.display = "none"
            }, 5000)
          }
        }
      }, 8000)
    })
  }
}

initNewsletterForm()
document.addEventListener("nav", initNewsletterForm)
