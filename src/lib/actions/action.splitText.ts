import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type SplitTextDirection = "fromTop" | "fromBottom";

type SplitTextOptions = {
  direction?: SplitTextDirection;
  jumpingLetters?: boolean;
};

export function useSplitText(
  node: HTMLElement,
  { direction = "fromBottom", jumpingLetters = true }: SplitTextOptions = {}
) {
  let timeline: gsap.core.Timeline | undefined;
  let split: SplitText | undefined;
  let observer: IntersectionObserver | undefined;
  let removeJumpListeners: (() => void) | undefined;
  let destroyed = false;

  const canJump = jumpingLetters && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const restore = () => {
    if (split?.isSplit) split.revert();
    gsap.set(node, { clearProps: "height,opacity" });
  };

  const play = () => {
    if (destroyed) return;

    const naturalHeight = node.getBoundingClientRect().height;

    split = SplitText.create(node, {
      type: "lines,words,chars",
      tag: "span",
      aria: "auto"
    });

    const lines = split.lines as HTMLElement[];
    const characters = split.chars as HTMLElement[];
    const charactersByLine = lines.map((line) => characters.filter((character) => line.contains(character)));
    const lineStep = lines.length > 1 ? lines[1].getBoundingClientRect().top - lines[0].getBoundingClientRect().top : 0;
    const directionMultiplier = direction === "fromTop" ? -1 : 1;
    const linesInAnimationOrder = direction === "fromTop" ? [...lines].reverse() : lines;
    const charactersInAnimationOrder = direction === "fromTop" ? [...charactersByLine].reverse() : charactersByLine;
    const jumpTargets: HTMLElement[] = [];

    if (canJump) {
      characters.forEach((character) => {
        const target = document.createElement("span");

        Object.assign(target.style, {
          display: "block",
          transformOrigin: "50% 100%"
        });
        target.textContent = character.textContent;
        character.replaceChildren(target);
        jumpTargets.push(target);
      });
    }

    gsap.set(split.words, { display: "inline-flex", whiteSpace: "nowrap" });
    gsap.set(split.chars, { display: "inline-block" });

    lines.forEach((line) => {
      const styles = getComputedStyle(line);
      const lineHeight = Number.parseFloat(styles.lineHeight);
      const clipOverflow = Number.parseFloat(styles.fontSize) * 0.15;

      Object.assign(line.style, {
        boxSizing: "border-box",
        display: "block",
        height: `${lineHeight + clipOverflow * 2}px`,
        marginBottom: `${-clipOverflow * 2}px`,
        overflow: "hidden",
        paddingBottom: `${clipOverflow}px`,
        paddingTop: `${clipOverflow}px`,
        position: "relative",
        top: `${-clipOverflow}px`,
        whiteSpace: "nowrap"
      });
    });

    gsap.set(lines, {
      y: (lineIndex) => {
        const lineOffset = direction === "fromTop" ? -lineIndex : lines.length - 1 - lineIndex;

        return lineOffset * lineStep;
      }
    });
    gsap.set(node, { height: naturalHeight });

    timeline = gsap.timeline({
      onStart: () => gsap.set(node, { opacity: 1 }),
      onComplete: () => {
        gsap.set(lines, {
          clearProps: "boxSizing,height,marginBottom,overflow,paddingBottom,paddingTop,position,top"
        });
        gsap.set(node, { clearProps: "height,opacity" });

        if (canJump) {
          const listeners = characters.map((character, index) => {
            const target = jumpTargets[index];
            const startJump = () => {
              if (target.classList.contains("animate-letter")) return;

              target.classList.add("animate-letter");
            };
            const finishJump = () => target.classList.remove("animate-letter");

            character.addEventListener("pointerenter", startJump);
            target.addEventListener("animationend", finishJump);

            return () => {
              character.removeEventListener("pointerenter", startJump);
              target.removeEventListener("animationend", finishJump);
              target.classList.remove("animate-letter");
            };
          });

          removeJumpListeners = () => listeners.forEach((removeListener) => removeListener());
        }
      }
    });

    charactersInAnimationOrder.forEach((characters, animationIndex) => {
      const lineStart = animationIndex * 0.735;

      if (animationIndex > 0) {
        const remainingLineCount = lines.length - 1 - animationIndex;

        timeline?.to(
          linesInAnimationOrder.slice(0, animationIndex),
          {
            y: remainingLineCount * lineStep * directionMultiplier,
            duration: 0.8,
            ease: "power4.inOut"
          },
          lineStart
        );
      }

      timeline?.fromTo(
        characters,
        {
          y: (characterIndex, character) => {
            const glyph = character.textContent ?? "";
            const getsLongRoll =
              !["y", "p", "q"].includes(glyph.toLowerCase()) && (characterIndex % 5 === 0 || characterIndex % 8 === 0);
            const distance = getsLongRoll ? 240 : 160;

            return `${distance * directionMultiplier}%`;
          }
        },
        {
          y: "0%",
          duration: 1,
          ease: "power4.inOut",
          stagger: (characterIndex) => characterIndex * gsap.utils.random(1, 5, 1) * 0.005
        },
        lineStart
      );
    });
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  gsap.set(node, { opacity: 0 });

  document.fonts.ready.then(() => {
    if (destroyed) return;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer?.disconnect();
        play();
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
  });

  return {
    destroy() {
      destroyed = true;
      observer?.disconnect();
      timeline?.kill();
      removeJumpListeners?.();
      restore();
    }
  };
}
