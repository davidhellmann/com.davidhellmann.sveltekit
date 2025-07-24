import lightGallery from "lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail/lg-thumbnail.min";
import lgZoom from "lightgallery/plugins/zoom/lg-zoom.min";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

export const useLightbox = (
  node: HTMLElement,
  {
    items,
    showThumbs = true,
    className = ""
  }: {
    items: {
      src: string | undefined;
      thumb: string | undefined;
      width: string | undefined;
    }[];
    showThumbs?: boolean;
    className?: string;
  }
) => {
  let dynamicGallery = lightGallery(node, {
    plugins: [lgThumbnail, lgZoom],
    addClass: className,
    download: false,
    thumbnail: showThumbs,
    counter: false,
    dynamic: true,
    infiniteZoom: false,
    dynamicEl: items
  });

  node.addEventListener("lgBeforeOpen", () => {
    document.getElementsByTagName("html")[0].classList.add("no-scroll");
  });
  node.addEventListener("lgBeforeClose", () => {
    document.getElementsByTagName("html")[0].classList.remove("no-scroll");
  });

  node.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const index = target.tagName === "IMG" ? target.getAttribute("data-index") || "0" : "0";
    dynamicGallery.openGallery(parseInt(index, 10));
  });

  return {
    update(newParams: { items: typeof items; showThumbs?: boolean; className?: string }) {
      dynamicGallery.updateSlides(newParams.items, 0);
    },
    destroy() {
      dynamicGallery.destroy();
      node.removeEventListener("click", () => {});
      node.removeEventListener("lgBeforeOpen", () => {});
      node.removeEventListener("lgBeforeClose", () => {});
    }
  };
};
