export const splitTextIntoDivs = (str?: string, animateClass: string = "is-zoomInDown", brIdentifier: string = "") => {
  return str
    ?.split("")
    ?.map((letter, index) => {
      if (letter === " ") return "&nbsp;";
      if (letter === brIdentifier) return "<span class='w-full'></span>";
      return `<div class="${animateClass}" data-waypoint-target data-letter-index="${index}">
        <span class="block origin-[50%_100%]">${letter}</span>
      </div>`;
    })
    ?.join("");
};
