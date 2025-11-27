type WaypointOptions = {
  delay?: number;
  staggeringDelay?: number;
  includeHolder?: boolean;
  endless?: boolean;
  threshold?: number[] | number;
  rootMargin?: string;
};

const defaultOptions: WaypointOptions = {
  delay: 50,
  staggeringDelay: 35,
  includeHolder: false,
  endless: false,
  threshold: 0,
  rootMargin: "0px 0px -50px 0px"
};

// Wait for any active view transition to finish
const waitForViewTransition = (): Promise<void> => {
  return new Promise((resolve) => {
    // Check if View Transitions API is supported and a transition is active
    const activeTransition = (document as any).activeViewTransition;
    if (activeTransition) {
      activeTransition.finished.then(resolve);
    } else {
      resolve();
    }
  });
};

export function useWaypoint(node: HTMLElement, options: WaypointOptions = {}) {
  const settings: WaypointOptions = { ...defaultOptions, ...options };
  const pendingTimeouts: Set<ReturnType<typeof setTimeout>> = new Set();
  let isDestroyed = false;
  let observer: IntersectionObserver | null = null;

  const getWaypointTargets = (holder: HTMLElement): Array<HTMLElement> => {
    const selector = "[data-waypoint-target]:not([data-waypoint])";
    const allTargets = holder.querySelectorAll<HTMLElement>(selector);
    const targets = Array.from(allTargets).filter((target) => target.closest("[data-waypoint]") === holder);

    const holderIsTarget = holder.hasAttribute("data-waypoint-target");
    return holderIsTarget ? (settings.includeHolder ? [holder, ...targets] : [holder]) : targets;
  };

  const animateElement = (element: HTMLElement, delay: number): void => {
    const timeoutId = setTimeout(() => {
      pendingTimeouts.delete(timeoutId);
      if (isDestroyed) return;
      element.setAttribute("data-waypoint-animated", "true");
    }, delay);
    pendingTimeouts.add(timeoutId);
  };

  const handleAnimateAttributes = (targets: HTMLElement[]) => {
    targets.forEach((target, index) => {
      const delay =
        settings.staggeringDelay && settings.delay ? settings.delay + settings.staggeringDelay * index : settings.delay;

      if (!target.hasAttribute("data-waypoint-animated") && delay) {
        animateElement(target, delay);
      }
    });
  };

  const initObserver = () => {
    if (isDestroyed) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const targets = getWaypointTargets(entry.target as HTMLElement);

          if (entry.isIntersecting) {
            if (!settings.endless && observer) observer.unobserve(entry.target);
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

    observer.observe(node);
  };

  // Wait for view transition then start observer
  // Use setTimeout to ensure DOM is settled after navigation
  setTimeout(() => {
    if (isDestroyed) return;
    waitForViewTransition().then(() => {
      if (isDestroyed) return;
      initObserver();
    });
  }, 50);

  // Optional: Setup mutation observer for dynamic content
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        const targets = getWaypointTargets(node);
        if (targets.length && observer) {
          observer.observe(node);
        }
      }
    });
  });

  mutationObserver.observe(node, {
    childList: true,
    attributes: false,
    subtree: true
  });

  const resetWaypoints = () => {
    const targets = getWaypointTargets(node);
    targets.forEach((target) => {
      target.removeAttribute("data-waypoint-animated");
      target.removeAttribute("data-waypoint-in-viewport");
    });
  };

  return {
    update(newOptions: WaypointOptions) {
      resetWaypoints();
      Object.assign(settings, { ...defaultOptions, ...newOptions });
    },
    destroy() {
      isDestroyed = true;
      pendingTimeouts.forEach((id) => clearTimeout(id));
      pendingTimeouts.clear();
      observer?.disconnect();
      mutationObserver.disconnect();
    }
  };
}
