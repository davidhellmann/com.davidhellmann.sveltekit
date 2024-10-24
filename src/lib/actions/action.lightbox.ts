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
    dynamic: true,
    dynamicEl: items
  });

  node.addEventListener("click", (e) => {
    dynamicGallery.openGallery(0);
  });

  return {
    destroy() {
      // Remove event listener when the element is destroyed
      node.removeEventListener("click", dynamicGallery.destroy);
    }
  };
};
