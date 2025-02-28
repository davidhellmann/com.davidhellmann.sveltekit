export const useJumpingLetters = (node: HTMLElement) => {
  const setupListeners = () => {
    const letterDivs = node.querySelectorAll("[data-letter-index]");
    letterDivs.forEach((div) => {
      div.addEventListener("mouseover", (event: Event) => {
        const span = (event.currentTarget as HTMLElement).querySelector("span");
        if (span) span.classList.add("animate-letter");
      });

      div.addEventListener("animationend", (event: Event) => {
        const span = (event.currentTarget as HTMLElement).querySelector("span");
        if (span) span.classList.remove("animate-letter");
      });
    });
  };

  setupListeners();

  const cleanup = () => {
    const letterDivs = node.querySelectorAll("[data-letter-index]");
    letterDivs.forEach((div) => {
      // Entferne alle Event-Listener
      div.replaceWith(div.cloneNode(true));
    });
  };

  return {
    update() {
      cleanup();
      setupListeners();
    },
    destroy() {
      cleanup();
    }
  };
};
