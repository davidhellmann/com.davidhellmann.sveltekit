export const splitTextIntoDivs = (str: string, animateClass: string = "is-zoomInDown", brIdentifier: string = "") => {
  return str
    .split("")
    .map((letter) => {
      if (letter === " ") return "&nbsp;";
      if (letter === brIdentifier) return "<span class='w-full'></span>";
      return `<div class="${animateClass}" data-waypoint-target>${letter}</div>`;
    })
    .join("");
};
