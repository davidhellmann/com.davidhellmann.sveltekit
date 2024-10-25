import lightGallery from "lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
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
    }[];
  }
) => {
  const dynamicGallery = lightGallery(node, {
    plugins: [lgThumbnail, lgZoom],
    download: false,
    thumbnail: true,
    counter: false,
    dynamic: true,
    dynamicEl: items
  });

  node.addEventListener("lgBeforeOpen", () => {
    document.getElementsByTagName("html")[0].classList.add("no-scroll");
  });
  node.addEventListener("lgBeforeClose", () => {
    document.getElementsByTagName("html")[0].classList.remove("no-scroll");
  });

  node.addEventListener("click", () => {
    dynamicGallery.openGallery(0);
  });

  return {
    destroy() {
      node.removeEventListener("click", dynamicGallery.destroy);
      node.removeEventListener("lgBeforeOpen", () => {});
      node.removeEventListener("lgBeforeClose", () => {});
    }
  };
};
