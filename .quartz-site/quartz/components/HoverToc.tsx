import TableOfContents from "./TableOfContents"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const Toc = TableOfContents()

  const HoverToc: QuartzComponent = ({ displayClass, ...props }: QuartzComponentProps) => {
    const classes = [displayClass, "hover-toc"].filter(Boolean).join(" ")

    return (
      <div class={classes}>
        <Toc {...props} />
      </div>
    )
  }

  HoverToc.css = Toc.css
  HoverToc.afterDOMLoaded = Toc.afterDOMLoaded
  HoverToc.beforeDOMLoaded = Toc.beforeDOMLoaded

  return HoverToc
}) satisfies QuartzComponentConstructor
