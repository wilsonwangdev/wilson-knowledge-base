// Sidebar collapse toggle — fixed button at left edge, like a drawer handle
const STORAGE_KEY = "sidebar-collapsed"

function createIcon(collapsed: boolean): string {
  // collapsed → show chevron-right (click to expand)
  // expanded → show chevron-left (click to collapse)
  if (collapsed) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`
}

function updateButton(btn: HTMLElement, collapsed: boolean) {
  const label = collapsed ? "展开侧边栏" : "收起侧边栏"
  btn.title = label
  btn.setAttribute("aria-label", label)
  btn.innerHTML = createIcon(collapsed)
}

function initSidebarCollapse() {
  const mq = window.matchMedia("(min-width: 1200px)")
  if (!mq.matches) return

  const body = document.getElementById("quartz-body")
  if (!body) return

  // Don't create duplicate buttons
  if (document.querySelector(".sidebar-collapse-btn")) return

  const saved = localStorage.getItem(STORAGE_KEY)
  const startCollapsed = saved === "true"

  // Create button — appended to body for fixed positioning
  const btn = document.createElement("button")
  btn.className = "sidebar-collapse-btn"
  updateButton(btn, startCollapsed)

  // Restore saved state
  if (startCollapsed) {
    body.classList.add("sb-collapsed")
  }

  btn.addEventListener("click", () => {
    const collapsed = body.classList.toggle("sb-collapsed")
    localStorage.setItem(STORAGE_KEY, String(collapsed))
    updateButton(btn, collapsed)
  })

  document.body.appendChild(btn)

  // Monitor resize to show/hide button when crossing desktop boundary
  mq.addEventListener("change", (e) => {
    if (e.matches) {
      // Entering desktop — restore saved state
      btn.style.display = ""
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === "true") {
        body.classList.add("sb-collapsed")
        updateButton(btn, true)
      } else {
        body.classList.remove("sb-collapsed")
        updateButton(btn, false)
      }
    } else {
      // Leaving desktop — hide button, restore sidebar
      btn.style.display = "none"
      body.classList.remove("sb-collapsed")
    }
  })
}

initSidebarCollapse()
document.addEventListener("nav", initSidebarCollapse)
