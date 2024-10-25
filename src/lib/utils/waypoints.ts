let observer: IntersectionObserver;

export type Settings = {
  delay: number;
  staggeringDelay: number;
  includeHolder: boolean;
  endless: boolean;
};

const observerSettings = {
  waypointTarget: "[data-waypoint-target]:not([data-waypoint])",
  settings: {
    delay: 50,
    staggeringDelay: 35,
    includeHolder: false,
    endless: false
  } as Settings,
  observerConfig: {
    threshold: [0],
    rootMargin: "0px 0px -10% 0px"
  }
};

const waypointObserver = (waypoints: HTMLElement[]) => {
  console.log("settings", observerSettings);
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      setSettings(entry.target as HTMLElement);
      const targets = getWaypointTargets(entry.target as HTMLElement);

      if (entry.isIntersecting) {
        if (!observerSettings.settings.endless) observer.unobserve(entry.target);
        entry.target.setAttribute("data-waypoint-in-viewport", "true");
        if (targets) handleAnimateAttributes(targets, observerSettings.settings);
      } else {
        entry.target.removeAttribute("data-waypoint-in-viewport");
        targets?.forEach((target) => target.removeAttribute("data-waypoint-animated"));
      }
    });
  }, observerSettings.observerConfig);

  waypoints.forEach((waypoint) => observer.observe(waypoint));
};

const setSettings = (waypoint: HTMLElement) => {
  observerSettings.settings.delay = getAttributeAsNumber(
    waypoint,
    "data-waypoint-delay",
    observerSettings.settings.delay
  );
  observerSettings.settings.staggeringDelay = getAttributeAsNumber(
    waypoint,
    "data-waypoint-staggering-delay",
    observerSettings.settings.staggeringDelay
  );
  observerSettings.settings.endless = waypoint.getAttribute("data-waypoint-endless") === "true";
  observerSettings.settings.includeHolder = waypoint.getAttribute("data-waypoint-include-holder") === "true";
};

const getWaypointTargets = (holder: HTMLElement): Array<HTMLElement> => {
  let targets = [...findWaypointTargets(holder)];
  const holderIsTarget = holder.hasAttribute("data-waypoint-target");
  if (holderIsTarget) targets = observerSettings.settings.includeHolder ? [holder, ...targets] : [holder];
  return targets;
};

const findWaypointTargets = (holder: HTMLElement): Array<HTMLElement> => {
  const allTargets = holder.querySelectorAll<HTMLElement>(observerSettings.waypointTarget);
  return Array.from(allTargets).filter((target) => target.closest("[data-waypoint]") === holder);
};

const handleAnimateAttributes = (targets: HTMLElement[], settings: Settings) => {
  targets.forEach((target, index) => {
    const delay: number =
      (settings.staggeringDelay && settings.delay
        ? settings.delay + settings.staggeringDelay * index
        : settings.delay) ?? 50;
    if (!target.hasAttribute("data-waypoint-animated")) animateElement(target, delay);
  });
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

const watchDomChanges = (waypoints: HTMLElement[], holder: HTMLElement) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        waypointObserver(waypoints);
      }
    });
  });
  observer.observe(holder, { childList: true, attributes: true, subtree: true });
};

export { waypointObserver, watchDomChanges, observer };
