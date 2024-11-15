export const useFullWidthText = (node: HTMLElement) => {
  const fwt = () => {
    const containerWidth = node.getBoundingClientRect().width;
    const textHolder = node.querySelector("span");
    if (!textHolder) return;

    const fontSize = parseFloat(getComputedStyle(textHolder).fontSize);
    const textHolderWidth = textHolder.getBoundingClientRect().width;

    const newFontSize = (containerWidth / textHolderWidth) * fontSize;

    Object.assign(textHolder.style, {
      fontSize: `${newFontSize}px`,
      wordBreak: "keep-all",
      whiteSpace: "pre",
      lineHeight: "1cap"
    });
  };

  setTimeout(fwt, 10);
  window.addEventListener("resize", fwt);

  return {
    destroy() {
      window.removeEventListener("rezize", fwt);
    }
  };
};
