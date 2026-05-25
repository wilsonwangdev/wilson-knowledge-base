let isReaderMode = false

const emitReaderModeChangeEvent = (mode: "on" | "off") => {
  const event: CustomEventMap["readermodechange"] = new CustomEvent("readermodechange", {
    detail: { mode },
  })
  document.dispatchEvent(event)
}

function createFloatingExitButton() {
  // Remove any existing first
  document.querySelector(".readermode-exit")?.remove()

  const btn = document.createElement("button")
  btn.className = "readermode-exit"
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
  btn.title = "退出阅读模式"
  btn.setAttribute("aria-label", "退出阅读模式")

  btn.addEventListener("click", () => {
    isReaderMode = false
    document.documentElement.setAttribute("reader-mode", "off")
    document.querySelector(".readermode-exit")?.remove()
    emitReaderModeChangeEvent("off")
  })

  document.body.appendChild(btn)
}

document.addEventListener("nav", () => {
  const switchReaderMode = () => {
    isReaderMode = !isReaderMode
    const newMode = isReaderMode ? "on" : "off"
    document.documentElement.setAttribute("reader-mode", newMode)

    if (isReaderMode) {
      createFloatingExitButton()
    } else {
      document.querySelector(".readermode-exit")?.remove()
    }

    emitReaderModeChangeEvent(newMode)
  }

  for (const readerModeButton of document.getElementsByClassName("readermode")) {
    readerModeButton.addEventListener("click", switchReaderMode)
    window.addCleanup(() => readerModeButton.removeEventListener("click", switchReaderMode))
  }

  // Set initial state
  document.documentElement.setAttribute("reader-mode", isReaderMode ? "on" : "off")
  if (isReaderMode) createFloatingExitButton()
})
