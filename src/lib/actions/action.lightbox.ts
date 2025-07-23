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

  const handleBeforeOpen = () => {
    document.getElementsByTagName("html")[0].classList.add("no-scroll");
  };
  
  const handleBeforeClose = () => {
    document.getElementsByTagName("html")[0].classList.remove("no-scroll");
  };

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const index = target.tagName === "IMG" ? target.getAttribute("data-index") || "0" : "0";
    dynamicGallery.openGallery(parseInt(index, 10));
  };

  node.addEventListener("lgBeforeOpen", handleBeforeOpen);
  node.addEventListener("lgBeforeClose", handleBeforeClose);
  node.addEventListener("click", handleClick);

  return {
    update(newParams: { items: typeof items; showThumbs?: boolean; className?: string }) {
      // Close the gallery if it's open
      if (dynamicGallery.lgOpened) {
        dynamicGallery.closeGallery();
      }
      
      // Destroy the old instance
      dynamicGallery.destroy();
      node.removeEventListener("click", handleClick);
      node.removeEventListener("lgBeforeOpen", handleBeforeOpen);
      node.removeEventListener("lgBeforeClose", handleBeforeClose);
      
      // Small delay to ensure proper cleanup
      setTimeout(() => {
        // Create a new instance with updated items
        dynamicGallery = lightGallery(node, {
          plugins: [lgThumbnail, lgZoom],
          addClass: newParams.className || className,
          download: false,
          thumbnail: newParams.showThumbs !== undefined ? newParams.showThumbs : showThumbs,
          counter: false,
          dynamic: true,
          infiniteZoom: false,
          dynamicEl: newParams.items
        });
        
        // Re-attach event listeners
        node.addEventListener("lgBeforeOpen", handleBeforeOpen);
        node.addEventListener("lgBeforeClose", handleBeforeClose);
        node.addEventListener("click", handleClick);
      }, 100);
    },
    destroy() {
      if (dynamicGallery.lgOpened) {
        dynamicGallery.closeGallery();
      }
      dynamicGallery.destroy();
      node.removeEventListener("click", handleClick);
      node.removeEventListener("lgBeforeOpen", handleBeforeOpen);
      node.removeEventListener("lgBeforeClose", handleBeforeClose);
    }
  };
};
