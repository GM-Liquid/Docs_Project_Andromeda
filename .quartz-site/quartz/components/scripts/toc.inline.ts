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

function updateTocDrawerButton(button: HTMLElement, expanded: boolean) {
  const label = expanded ? "Скрыть содержание" : "Показать содержание"
  button.setAttribute("aria-expanded", expanded ? "true" : "false")
  button.setAttribute("aria-label", label)
  button.setAttribute("title", label)
}

function setTocDrawerExpanded(sidebar: Element, expanded: boolean) {
  sidebar.classList.toggle("toc-open", expanded)

  const button = sidebar.querySelector(".toc-drawer-toggle")
  if (button instanceof HTMLElement) {
    updateTocDrawerButton(button, expanded)
  }
}

function toggleTocDrawer(this: HTMLElement) {
  const sidebar = this.closest(".left.sidebar")
  if (!sidebar) return

  const expanded = !sidebar.classList.contains("toc-open")
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
    setTocDrawerExpanded(desktopSidebar, true)
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

  // update toc entry highlighting
  observer.disconnect()
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  headers.forEach((header) => observer.observe(header))
})
