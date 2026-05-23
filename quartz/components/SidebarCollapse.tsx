import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/sidebar-collapse.inline"

export default (() => {
  const SidebarCollapse: QuartzComponent = () => {
    return null // No rendered output — the script creates the button
  }

  SidebarCollapse.afterDOMLoaded = script
  return SidebarCollapse
}) satisfies QuartzComponentConstructor
