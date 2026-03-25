import { pathToRoot } from "../util/path"
import { concatenateResources } from "../util/resources"
import { i18n } from "../i18n"
import Darkmode from "./Darkmode"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ThemeToggle = Darkmode()

const styles = `
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--lightgray);
}

.site-header-title {
  font-family: var(--titleFont);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.2;
  color: var(--dark);
}

.site-header-title:hover {
  color: var(--secondary);
}

.site-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
}

.site-header .darkmode {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--lightgray);
  border-radius: 999px;
  background: color-mix(in srgb, var(--lightgray) 26%, transparent);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.site-header .darkmode:hover {
  background: var(--highlight);
  border-color: var(--secondary);
  transform: translateY(-1px);
}

.site-header .darkmode svg {
  width: 1rem;
  height: 1rem;
  top: calc(50% - 0.5rem);
  left: calc(50% - 0.5rem);
}

.site-header + .article-title {
  margin-top: 1.25rem;
}

@media all and (max-width: 800px) {
  .site-header {
    padding-bottom: 0.7rem;
  }

  .site-header-title {
    font-size: 0.82rem;
    letter-spacing: 0.06em;
  }
}
`

const SiteHeader: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, cfg } = props
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)

  return (
    <div class="site-header">
      <a class="site-header-title" href={baseDir}>
        {title}
      </a>
      <div class="site-header-actions">
        <ThemeToggle {...props} />
      </div>
    </div>
  )
}

SiteHeader.css = concatenateResources(styles, ThemeToggle.css)
SiteHeader.beforeDOMLoaded = ThemeToggle.beforeDOMLoaded
SiteHeader.afterDOMLoaded = ThemeToggle.afterDOMLoaded

export default (() => SiteHeader) satisfies QuartzComponentConstructor
