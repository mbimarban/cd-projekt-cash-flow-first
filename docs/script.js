// Simple interactivity for the GitHub Pages microsite.
(function () {
  document.body.dataset.interactiveReady = "true";

  const glossaryDefinitions = {
    cfo: {
      title: "CFO",
      description: "Przepływy pieniężne z działalności operacyjnej; pokazują, ile realnej gotówki generuje podstawowy biznes."
    },
    "cash-engine": {
      title: "Cash engine",
      description: "Silnik gotówkowy obecnego biznesu — zdolność istniejących gier i katalogu do generowania gotówki."
    },
    "development-burn": {
      title: "Development burn",
      description: "Gotówka zużywana na produkcję przyszłych gier i rozwój pipeline'u."
    },
    ip: {
      title: "IP",
      description: "Własność intelektualna; w gamingu to marka, świat gry, postacie, historia, rozpoznawalność i prawa do komercyjnego wykorzystania."
    },
    aaa: {
      title: "AAA",
      description: "Wysokobudżetowe gry klasy premium, tworzone przez duże zespoły przez wiele lat, z dużym potencjałem sprzedaży i dużym ryzykiem wykonawczym."
    },
    pipeline: {
      title: "Pipeline",
      description: "Portfel gier i projektów w przygotowaniu, które mają w przyszłości zamienić obecne nakłady na przychody i cash flow."
    },
    amortization: {
      title: "Amortyzacja nakładów na prace rozwojowe",
      description: "Koszt księgowy rozliczający wcześniej poniesione nakłady rozwojowe w czasie; nie oznacza nowego wypływu gotówki w momencie ujęcia."
    },
    gog: {
      title: "Działalność zaniechana / GOG",
      description: "Element wyniku, który może poprawiać zysk netto razem, ale nie powinien być traktowany jako powtarzalny rdzeń cash engine CD Projekt RED."
    }
  };

  const animatePanel = (panel, expand) => {
    const startHeight = expand ? 0 : panel.scrollHeight;
    if (expand) {
      panel.hidden = false;
    }
    const endHeight = expand ? panel.scrollHeight : 0;

    panel.style.height = `${startHeight}px`;
    panel.style.overflow = "hidden";

    requestAnimationFrame(() => {
      panel.style.transition = "height 220ms ease";
      panel.style.height = `${endHeight}px`;
    });

    const cleanup = () => {
      panel.style.removeProperty("height");
      panel.style.removeProperty("overflow");
      panel.style.removeProperty("transition");
      if (!expand) {
        panel.hidden = true;
      }
      panel.removeEventListener("transitionend", cleanup);
    };

    panel.addEventListener("transitionend", cleanup);
  };

  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = trigger.parentElement.nextElementSibling;
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      animatePanel(panel, !expanded);
    });
  });

  document.querySelectorAll(".risk-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const body = trigger.nextElementSibling;
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      animatePanel(body, !expanded);
    });
  });

  const popover = document.getElementById("glossary-popover");
  const popoverTitle = document.getElementById("glossary-title");
  const popoverDescription = document.getElementById("glossary-description");

  const hidePopover = () => {
    if (popover) {
      popover.hidden = true;
    }
  };

  document.querySelectorAll(".glossary-term").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const termKey = button.dataset.term;
      const definition = glossaryDefinitions[termKey];
      if (!definition || !popover || !popoverTitle || !popoverDescription) {
        return;
      }
      popoverTitle.textContent = definition.title;
      popoverDescription.textContent = definition.description;
      popover.hidden = false;
      const rect = button.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const margin = 12;
      let top = rect.bottom + 10;
      let left = rect.left;
      if (left + popoverRect.width > window.innerWidth - margin) {
        left = window.innerWidth - popoverRect.width - margin;
      }
      if (left < margin) {
        left = margin;
      }
      if (top + popoverRect.height > window.innerHeight - margin) {
        top = rect.top - popoverRect.height - 10;
      }
      if (top < margin) {
        top = margin;
      }
      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".glossary-term") && !event.target.closest(".glossary-popover")) {
      hidePopover();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hidePopover();
    }
  });

  const setActiveCollection = (buttons, panels, targetKey, buttonClassName, panelAttribute) => {
    buttons.forEach((button) => {
      const isActive = button.dataset[panelAttribute] === targetKey;
      button.classList.toggle(buttonClassName, isActive);
      if (button.getAttribute("role") === "tab") {
        button.setAttribute("aria-selected", String(isActive));
      }
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset[`${panelAttribute}Panel`] === targetKey || panel.dataset.panel === targetKey;
      panel.classList.toggle(buttonClassName, isActive);
      panel.hidden = !isActive;
    });
  };

  const timelineButtons = document.querySelectorAll(".timeline-item");
  const timelinePanels = document.querySelectorAll(".timeline-panel");
  timelineButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveCollection(timelineButtons, timelinePanels, button.dataset.timeline, "is-active", "timeline");
    });
  });

  const scenarioTabs = document.querySelectorAll(".scenario-tab");
  const scenarioPanels = document.querySelectorAll(".scenario-panel");
  scenarioTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveCollection(scenarioTabs, scenarioPanels, button.dataset.scenario, "is-active", "scenario");
    });
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("nav-list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navList.classList.toggle("is-open", !expanded);
    });
  }

  const sectionLinks = document.querySelectorAll(".section-nav a");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const matchingLink = document.querySelector(`.section-nav a[href="#${entry.target.id}"]`);
        if (matchingLink) {
          sectionLinks.forEach((link) => {
            link.classList.toggle("is-active", link === matchingLink);
          });
        }
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0.1 }
  );

  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));

  // Smooth-scroll nav links with responsive offset
  sectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) {
        return;
      }
      const target = document.querySelector(href);
      if (!target) {
        return;
      }
      event.preventDefault();
      const offset = window.innerWidth < 900 ? 16 : 28;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
      try { history.pushState(null, "", href); } catch (_) {}
      sectionLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
      const navToggle = document.querySelector(".nav-toggle");
      const navList = document.getElementById("nav-list");
      if (navToggle && navList && window.innerWidth < 900) {
        navToggle.setAttribute("aria-expanded", "false");
        navList.classList.remove("is-open");
      }
    });
  });
})();
