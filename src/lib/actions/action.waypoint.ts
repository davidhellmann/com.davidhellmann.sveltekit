type WaypointOptions = {
  delay?: number;
  staggeringDelay?: number;
  includeHolder?: boolean;
  endless?: boolean;
  threshold?: number[];
  rootMargin?: string;
};

const defaultOptions = {
  delay: 50,
  staggeringDelay: 35,
  includeHolder: false,
  endless: false,
  threshold: [0],
  rootMargin: "0px 0px -10% 0px"
};

export function useWaypoint(node: HTMLElement, options: WaypointOptions = {}) {
  const settings = { ...defaultOptions, ...options };

  const getWaypointTargets = (holder: HTMLElement): Array<HTMLElement> => {
    const selector = "[data-waypoint-target]:not([data-waypoint])";
    const allTargets = holder.querySelectorAll<HTMLElement>(selector);
    const targets = Array.from(allTargets).filter((target) => target.closest("[data-waypoint]") === holder);

    const holderIsTarget = holder.hasAttribute("data-waypoint-target");
    return holderIsTarget ? (settings.includeHolder ? [holder, ...targets] : [holder]) : targets;
  };

  const animateElement = (element: HTMLElement, delay: number): void => {
    setTimeout(() => {
      element.setAttribute("data-waypoint-animated", "true");
    }, delay);
  };

  const handleAnimateAttributes = (targets: HTMLElement[]) => {
    targets.forEach((target, index) => {
      const delay =
        settings.staggeringDelay && settings.delay ? settings.delay + settings.staggeringDelay * index : settings.delay;

      if (!target.hasAttribute("data-waypoint-animated")) {
        animateElement(target, delay);
      }
    });
  };

  // Create and start the observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const targets = getWaypointTargets(entry.target as HTMLElement);

        if (entry.isIntersecting) {
          if (!settings.endless) observer.unobserve(entry.target);
          entry.target.setAttribute("data-waypoint-in-viewport", "true");
          if (targets) handleAnimateAttributes(targets);
        } else {
          entry.target.removeAttribute("data-waypoint-in-viewport");
          targets?.forEach((target) => target.removeAttribute("data-waypoint-animated"));
        }
      });
    },
    {
      threshold: settings.threshold,
      rootMargin: settings.rootMargin
    }
  );

  // Start observing the node
  observer.observe(node);

  // Optional: Setup mutation observer for dynamic content
  const mutationObserver = new MutationObserver(() => {
    const targets = getWaypointTargets(node);
    if (targets.length) {
      observer.observe(node);
    }
  });

  // Optional: Setup mutation observer for dynamic content
  // const mutationObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     if (mutation.type === "childList") {
  //       mutation.addedNodes.forEach((node) => {
  //         if (node instanceof HTMLElement && !node.hasAttribute("data-waypoint")) {
  //           observer.observe(node);
  //         }
  //       });
  //     }
  //   });
  // });

  mutationObserver.observe(node, {
    childList: true,
    attributes: true,
    subtree: true
  });

  return {
    update(newOptions: WaypointOptions) {
      // Handle updates to options
      Object.assign(settings, { ...defaultOptions, ...newOptions });
    },
    destroy() {
      // Cleanup
      observer.disconnect();
      mutationObserver.disconnect();
    }
  };
}
