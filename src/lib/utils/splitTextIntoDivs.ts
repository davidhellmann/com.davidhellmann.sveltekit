export const splitTextIntoDivs = (str: string, animateClass: string = "is-zoomInDown", brIdentifier: string = "") => {
  const html = str
    .split("")
    .map((letter, index) => {
      if (letter === " ") return "&nbsp;";
      if (letter === brIdentifier) return "<span class='w-full'></span>";
      return `<div class="${animateClass}" data-waypoint-target data-letter-index="${index}">
        <span class="block origin-[50%_100%]">${letter}</span>
      </div>`;
    })
    .join("");

  // Function to set up event listeners after the component is mounted
  const setupEventListeners = (container: HTMLElement) => {
    const letterDivs = container.querySelectorAll("[data-letter-index]");
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

  return { html, setupEventListeners };
};
