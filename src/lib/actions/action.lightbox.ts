import lightGallery from "lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail/lg-thumbnail.min";
import lgZoom from "lightgallery/plugins/zoom/lg-zoom.min";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

export const useLightbox = (
  node: HTMLElement,
  {
    items
  }: {
    items: {
      src: string | undefined;
      thumb: string | undefined;
      width: string | undefined;
    }[];
  }
) => {
  const dynamicGallery = lightGallery(node, {
    plugins: [lgThumbnail, lgZoom],
    download: false,
    thumbnail: true,
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
    destroy() {
      node.removeEventListener("click", dynamicGallery.destroy);
      node.removeEventListener("lgBeforeOpen", () => {});
      node.removeEventListener("lgBeforeClose", () => {});
    }
  };
};
