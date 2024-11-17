import { lazyLoad } from "unlazy";
export function useUnlazy(node: HTMLImageElement, lazy: boolean = true) {
  if (!lazy) return;
  lazyLoad(node);

  return {
    destroy() {}
  };
}
