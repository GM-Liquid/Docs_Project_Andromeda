import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

export default (() => {
  const TocDrawerToggle: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const label =
      cfg.locale === "ru-RU"
        ? "\u0421\u043a\u0440\u044b\u0442\u044c \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u043d\u0438\u0435"
        : "Hide table of contents"

    return (
      <button
        class={classNames(displayClass, "toc-drawer-toggle")}
        type="button"
        aria-controls="desktop-toc-drawer"
        aria-expanded="true"
        aria-label={label}
        title={label}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="toc-drawer-toggle-icon"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    )
  }

  return TocDrawerToggle
}) satisfies QuartzComponentConstructor
