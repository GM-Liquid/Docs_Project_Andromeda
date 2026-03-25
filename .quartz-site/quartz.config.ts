import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Проект Андромеда",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: null,
    locale: "ru-RU",
    baseUrl: "gm-liquid.github.io/Docs_Project_Andromeda",
    ignorePatterns: ["private", "templates", ".obsidian", ".quartz-cache", ".npm-cache"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        title: "IBM Plex Sans",
        header: "IBM Plex Sans",
        body: "Noto Serif",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f5efe4",
          lightgray: "#d8ccbb",
          gray: "#a99784",
          darkgray: "#5b4c3c",
          dark: "#251d17",
          secondary: "#1d6470",
          tertiary: "#9a5538",
          highlight: "rgba(29, 100, 112, 0.12)",
          textHighlight: "#f0dd7888",
        },
        darkMode: {
          light: "#151313",
          lightgray: "#302a27",
          gray: "#76685c",
          darkgray: "#d6c9bb",
          dark: "#f3eadf",
          secondary: "#79b8c0",
          tertiary: "#d18a6c",
          highlight: "rgba(121, 184, 192, 0.16)",
          textHighlight: "#b9a63288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: false,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
