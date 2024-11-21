export const splitTextIntoDivs = (str: string, animateClass: string = "is-zoomInDown", spaceToBr: boolean = false) => {
  return str
    .split("")
    .map((letter) =>
      letter === " "
        ? spaceToBr
          ? "<span class='w-full'></span>"
          : "&nbsp;"
        : `
    <div class="${animateClass}" data-waypoint-target>
      ${letter}
    </div>
  `
    )
    .join("");
};
