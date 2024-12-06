import { lazyLoad, autoSizes } from "unlazy";

export function useUnlazy(node: HTMLImageElement, lazy: boolean = true) {
  if (lazy) {
    lazyLoad(node);
  } else {
    autoSizes();
  }

  return {
    destroy() {}
  };
}
