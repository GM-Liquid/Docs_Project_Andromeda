import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import SiteHeader from "./quartz/components/SiteHeader"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      Исходники: "https://github.com/GM-Liquid/Docs_Project_Andromeda",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [SiteHeader(), Component.MobileOnly(Component.TableOfContents())],
  left: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Darkmode() },
      ],
    }),
  ],
  right: [],
}
