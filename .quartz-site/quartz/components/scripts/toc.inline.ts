const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const slug = entry.target.id
    const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`)
    const windowHeight = entry.rootBounds?.height

    if (windowHeight && tocEntryElements.length > 0) {
      const isInView = entry.boundingClientRect.y < windowHeight

      if (entry.boundingClientRect.y < windowHeight) {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.add("in-view"))
      } else {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.remove("in-view"))
      }

      tocEntryElements.forEach((tocEntryElement) => {
        const group = tocEntryElement.closest(".toc-group")
        if (!group) return

        if (isInView) {
          setTocGroupExpanded(group, true)
        }

        updateGroupHighlight(group)
      })
    }
  }
})

const tocDrawerStorageKey = "quartz.desktopTocOpen"
const tocDrawerLabels = {
  expanded: "\u0421\u043a\u0440\u044b\u0442\u044c \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u043d\u0438\u0435",
  collapsed: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u043d\u0438\u0435",
}

function readStoredTocDrawerState() {
  try {
    const storedValue = window.localStorage.getItem(tocDrawerStorageKey)
    if (storedValue === "true") return true
    if (storedValue === "false") return false
  } catch {
    // Ignore storage access issues and keep the default state.
  }

  return null
}

function writeStoredTocDrawerState(expanded: boolean) {
  try {
    window.localStorage.setItem(tocDrawerStorageKey, expanded ? "true" : "false")
  } catch {
    // Ignore storage access issues and keep the current UI state.
  }
}

function updateTocDrawerButton(button: HTMLElement, expanded: boolean) {
  const label = expanded ? tocDrawerLabels.expanded : tocDrawerLabels.collapsed
  button.setAttribute("aria-expanded", expanded ? "true" : "false")
  button.setAttribute("aria-label", label)
  button.setAttribute("title", label)
}

function setTocDrawerExpanded(sidebar: Element, expanded: boolean) {
  sidebar.classList.toggle("toc-open", expanded)
  sidebar.classList.toggle("toc-collapsed", !expanded)

  const quartzBody = sidebar.closest("#quartz-body")
  quartzBody?.classList.toggle("toc-sidebar-collapsed", !expanded)

  const button = sidebar.querySelector(".toc-drawer-toggle")
  if (button instanceof HTMLElement) {
    updateTocDrawerButton(button, expanded)
  }

  writeStoredTocDrawerState(expanded)
}

function toggleTocDrawer(this: HTMLElement) {
  const sidebar = this.closest(".left.sidebar")
  if (!sidebar) return

  const expanded = sidebar.classList.contains("toc-collapsed")
  setTocDrawerExpanded(sidebar, expanded)
}

function setTocGroupExpanded(group: Element, expanded: boolean) {
  const toggle = group.querySelector(".toc-group-toggle")
  const content = group.querySelector(".toc-group-items")
  if (!toggle || !content) return

  group.classList.toggle("collapsed", !expanded)
  toggle.classList.toggle("collapsed", !expanded)
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false")
  content.classList.toggle("collapsed", !expanded)

  const toc = group.closest(".toc")
  if (toc) {
    updateTocOverflow(toc)
  }
}

function updateGroupHighlight(group: Element) {
  const chapterLink = group.querySelector(".toc-group-link")
  if (!chapterLink) return

  const hasActiveEntries = group.querySelectorAll("a.in-view").length > 0
  chapterLink.classList.toggle("in-view", hasActiveEntries)
}

function toggleTocGroup(this: HTMLElement) {
  const group = this.closest(".toc-group")
  if (!group) return

  const expanded = this.getAttribute("aria-expanded") !== "true"
  setTocGroupExpanded(group, expanded)
}

function expandGroupForHash() {
  const hash = window.location.hash.slice(1)
  if (!hash) return

  const tocEntryElement = document.querySelector(`a[data-for="${CSS.escape(hash)}"]`)
  const group = tocEntryElement?.closest(".toc-group")
  if (!group) return

  setTocGroupExpanded(group, true)
  updateGroupHighlight(group)
}

function updateTocOverflow(toc: Element) {
  const content = toc.querySelector(".toc-content.overflow")
  if (!(content instanceof HTMLElement)) return

  const isOverflowing = content.scrollHeight > content.clientHeight + 1
  toc.classList.toggle("toc-scrollable", isOverflowing)

  if (!isOverflowing) {
    content.classList.remove("gradient-active")
  }
}

function setupToc() {
  const desktopSidebar = document.querySelector(".left.sidebar")
  const drawerToggle = desktopSidebar?.querySelector(".toc-drawer-toggle")
  const desktopToc = desktopSidebar?.querySelector(".toc.desktop-only")

  if (desktopSidebar && drawerToggle && desktopToc) {
    setTocDrawerExpanded(desktopSidebar, readStoredTocDrawerState() ?? true)
    drawerToggle.addEventListener("click", toggleTocDrawer)
    window.addCleanup(() => drawerToggle.removeEventListener("click", toggleTocDrawer))
  }

  for (const toc of document.getElementsByClassName("toc")) {
    const groupToggles = toc.querySelectorAll(".toc-group-toggle")
    groupToggles.forEach((toggle) => {
      toggle.addEventListener("click", toggleTocGroup)
      window.addCleanup(() => toggle.removeEventListener("click", toggleTocGroup))
    })

    const updateOverflow = () => updateTocOverflow(toc)
    updateOverflow()

    const resizeObserver = new ResizeObserver(updateOverflow)
    resizeObserver.observe(toc)
    window.addCleanup(() => resizeObserver.disconnect())

    window.addEventListener("resize", updateOverflow)
    window.addCleanup(() => window.removeEventListener("resize", updateOverflow))
  }

  expandGroupForHash()

  for (const toc of document.getElementsByClassName("toc")) {
    updateTocOverflow(toc)
  }
}

document.addEventListener("nav", () => {
  setupToc()

  observer.disconnect()
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  headers.forEach((header) => observer.observe(header))
})
