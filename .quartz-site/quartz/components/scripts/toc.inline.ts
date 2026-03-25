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

function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setTocGroupExpanded(group: Element, expanded: boolean) {
  const toggle = group.querySelector(".toc-group-toggle")
  const content = group.querySelector(".toc-group-items")
  if (!toggle || !content) return

  group.classList.toggle("collapsed", !expanded)
  toggle.classList.toggle("collapsed", !expanded)
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false")
  content.classList.toggle("collapsed", !expanded)
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

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    if (!button || !content) continue
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))

    const groupToggles = toc.querySelectorAll(".toc-group-toggle")
    groupToggles.forEach((toggle) => {
      toggle.addEventListener("click", toggleTocGroup)
      window.addCleanup(() => toggle.removeEventListener("click", toggleTocGroup))
    })
  }

  expandGroupForHash()
}

document.addEventListener("nav", () => {
  setupToc()

  // update toc entry highlighting
  observer.disconnect()
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  headers.forEach((header) => observer.observe(header))
})
