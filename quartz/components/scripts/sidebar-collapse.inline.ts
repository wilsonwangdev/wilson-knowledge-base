// Sidebar collapse toggle — persists state in localStorage
const STORAGE_KEY = "sidebar-collapsed"

function initSidebarCollapse() {
  const body = document.getElementById("quartz-body")
  if (!body) return

  const sidebar = body.querySelector(".sidebar.left") as HTMLElement
  if (!sidebar) return

  // Don't create duplicate buttons
  if (sidebar.querySelector(".sidebar-collapse-btn")) return

  // Only add toggle on desktop — mobile already has the Explorer hamburger
  const mq = window.matchMedia("(min-width: 1200px)")
  if (!mq.matches) return

  // Create toggle button
  const btn = document.createElement("button")
  btn.className = "sidebar-collapse-btn"
  btn.setAttribute("aria-label", "收起侧边栏")
  btn.title = "收起侧边栏"
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`

  // Restore saved state
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === "true") {
    body.classList.add("sb-collapsed")
    btn.title = "展开侧边栏"
    btn.setAttribute("aria-label", "展开侧边栏")
  }

  btn.addEventListener("click", () => {
    const collapsed = body.classList.toggle("sb-collapsed")
    localStorage.setItem(STORAGE_KEY, String(collapsed))
    btn.title = collapsed ? "展开侧边栏" : "收起侧边栏"
    btn.setAttribute("aria-label", collapsed ? "展开侧边栏" : "收起侧边栏")
  })

  sidebar.appendChild(btn)

  // Also toggle on resize
  mq.addEventListener("change", (e) => {
    if (e.matches) {
      // Switching to desktop — apply saved state
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === "true") {
        body.classList.add("sb-collapsed")
      }
    }
  })
}

initSidebarCollapse()
document.addEventListener("nav", initSidebarCollapse)
