const desktopRulebookNav = window.matchMedia("(min-width: 1200px)");

function closeRulebookItem(item: HTMLElement) {
  item.removeAttribute("data-open");
}

function openRulebookItem(item: HTMLElement) {
  if (!desktopRulebookNav.matches || item.dataset.hasFlyout !== "true") {
    return;
  }

  const nav = item.closest(".rulebook-nav");
  if (!nav) {
    return;
  }

  nav
    .querySelectorAll(".rulebook-nav-item[data-open='true']")
    .forEach((openItem) => {
      if (openItem !== item) {
        closeRulebookItem(openItem as HTMLElement);
      }
    });

  item.setAttribute("data-open", "true");
}

function setupRulebookNav() {
  const navs = document.querySelectorAll(".rulebook-nav");

  navs.forEach((nav) => {
    const flyoutItems = nav.querySelectorAll(
      ".rulebook-nav-item[data-has-flyout='true']",
    ) as NodeListOf<HTMLElement>;

    flyoutItems.forEach((item) => {
      const onMouseEnter = () => openRulebookItem(item);
      const onMouseLeave = () => closeRulebookItem(item);
      const onFocusIn = () => openRulebookItem(item);
      const onFocusOut = (event: FocusEvent) => {
        const nextTarget = event.relatedTarget as Node | null;
        if (nextTarget && item.contains(nextTarget)) {
          return;
        }

        closeRulebookItem(item);
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape") {
          return;
        }

        closeRulebookItem(item);
        const link = item.querySelector(
          ".rulebook-nav-link",
        ) as HTMLElement | null;
        link?.focus();
      };

      item.addEventListener("mouseenter", onMouseEnter);
      item.addEventListener("mouseleave", onMouseLeave);
      item.addEventListener("focusin", onFocusIn);
      item.addEventListener("focusout", onFocusOut);
      item.addEventListener("keydown", onKeyDown);

      window.addCleanup(() =>
        item.removeEventListener("mouseenter", onMouseEnter),
      );
      window.addCleanup(() =>
        item.removeEventListener("mouseleave", onMouseLeave),
      );
      window.addCleanup(() => item.removeEventListener("focusin", onFocusIn));
      window.addCleanup(() => item.removeEventListener("focusout", onFocusOut));
      window.addCleanup(() => item.removeEventListener("keydown", onKeyDown));
    });
  });

  const onViewportChange = () => {
    if (desktopRulebookNav.matches) {
      return;
    }

    document
      .querySelectorAll(".rulebook-nav-item[data-open='true']")
      .forEach((item) => {
        closeRulebookItem(item as HTMLElement);
      });
  };

  desktopRulebookNav.addEventListener("change", onViewportChange);
  window.addCleanup(() =>
    desktopRulebookNav.removeEventListener("change", onViewportChange),
  );
}

document.addEventListener("nav", setupRulebookNav);
