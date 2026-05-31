document.addEventListener("nav", () => {
  const btn = document.querySelector(".share-button") as HTMLButtonElement | null
  if (!btn) return

  const toast = document.querySelector(".share-toast") as HTMLElement | null

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      if (toast) {
        toast.classList.add("show")
        setTimeout(() => toast.classList.remove("show"), 2000)
      }
    } catch {
      // Fallback for older browsers / non-HTTPS
      const textarea = document.createElement("textarea")
      textarea.value = window.location.href
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      if (toast) {
        toast.classList.add("show")
        setTimeout(() => toast.classList.remove("show"), 2000)
      }
    }
  })
})
