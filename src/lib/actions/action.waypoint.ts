import { waypointObserver, watchDomChanges, observer } from "$utils/waypoints";

export const useWaypoint = (node: HTMLElement) => {
  const waypointEls = node.querySelectorAll<HTMLElement>("[data-waypoint]") ?? [];
  const nodeAsWaypoint = node.dataset.waypoint ? [node] : [];

  waypointObserver([...waypointEls, ...nodeAsWaypoint]);
  watchDomChanges([...waypointEls, ...nodeAsWaypoint], node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
};
