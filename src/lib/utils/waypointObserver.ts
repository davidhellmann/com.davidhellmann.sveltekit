type Settings = {
  delay: number;
  staggeringDelay: number;
  includeHolder: boolean;
  endless: boolean;
};

type WaypointObserver = {
  name: string;
  selectors?: { [key: string]: string };
  observerConfig: { threshold: number[]; rootMargin: string };
  settings: Settings;

  startObserving(el: NodeListOf<HTMLElement>): void;
  setSettings(el: Element): void;
  findWaypointTargets(el: Element): HTMLElement[];
  getWaypointTargets(el: Element): HTMLElement[];
  handleAnimateAttributes(el: HTMLElement[], settings: Settings): void;
  watchDomChanges(): void;
  init(el: HTMLElement | NodeListOf<HTMLElement>): void;
};

const getAttributeAsNumber = (element: Element, attributeName: string, defaultValue: number): number => {
  const value = element.getAttribute(attributeName);
  return value ? parseInt(value, 10) : defaultValue;
};

const animateElement = (element: HTMLElement, delay: number): void => {
  setTimeout(() => {
    element.setAttribute("data-waypoint-animated", "true");
  }, delay);
};

const waypointObserver: WaypointObserver = {
  name: "waypointObserver",
  selectors: {
    waypointTarget: "[data-waypoint-target]:not([data-waypoint])"
  },
  settings: {
    delay: 50,
    staggeringDelay: 35,
    includeHolder: false,
    endless: false
  },
  observerConfig: {
    threshold: [0],
    rootMargin: "0px 0px -10% 0px"
  },

  startObserving(waypoints) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.setSettings(entry.target);
        const targets = this.getWaypointTargets(entry.target);

        if (entry.isIntersecting) {
          if (!this.settings.endless) observer.unobserve(entry.target);
          entry.target.setAttribute("data-waypoint-in-viewport", "true");
          if (targets) this.handleAnimateAttributes(targets, this.settings);
        } else {
          entry.target.removeAttribute("data-waypoint-in-viewport");
          targets?.forEach((target) => target.removeAttribute("data-waypoint-animated"));
        }
      });
    }, this.observerConfig);

    waypoints.forEach((waypoint) => observer.observe(waypoint));
  },

  setSettings(waypoint) {
    this.settings.delay = getAttributeAsNumber(waypoint, "data-waypoint-delay", this.settings.delay);

    this.settings.staggeringDelay = getAttributeAsNumber(
      waypoint,
      "data-waypoint-staggering-delay",
      this.settings.staggeringDelay
    );

    this.settings.endless = waypoint.getAttribute("data-waypoint-endless") === "true";
    this.settings.includeHolder = waypoint.getAttribute("data-waypoint-include-holder") === "true";
  },

  findWaypointTargets(holder) {
    if (!this.selectors) return [];
    const allTargets = holder.querySelectorAll<HTMLElement>(this.selectors.waypointTarget);
    return Array.from(allTargets).filter((target) => target.closest("[data-waypoint]") === holder);
  },

  getWaypointTargets(holder: HTMLElement): Array<HTMLElement> {
    if (!this.selectors) return [];
    let targets = [...this.findWaypointTargets(holder)];
    const holderIsTarget = holder.hasAttribute("data-waypoint-target");
    if (holderIsTarget) targets = this.settings.includeHolder ? [holder, ...targets] : [holder];
    return targets;
  },

  handleAnimateAttributes(targets, settings) {
    targets.forEach((target, index) => {
      const delay = settings.staggeringDelay ? settings.delay + settings.staggeringDelay * index : settings.delay;
      if (!target.hasAttribute("data-waypoint-animated")) animateElement(target, delay);
    });
  },

  watchDomChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const waypointEls = document.querySelectorAll("[data-waypoint]");
          this.startObserving(waypointEls as NodeListOf<HTMLElement>);
        }
      });
    });
    observer.observe(document.body, { childList: true, attributes: true, subtree: true });
  },

  init(waypointEls) {
    this.startObserving(waypointEls as NodeListOf<HTMLElement>);
    this.watchDomChanges();
  }
};

export default waypointObserver;
