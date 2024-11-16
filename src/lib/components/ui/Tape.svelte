<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import { getRandomNumberFromRange } from "$lib/utils/getRandomNumberFromRange";

  const tvTape = tv({
    base: `
    overflow-hidden
      absolute
      bg-gradient-to-br from-neutral-500/10 via-neutral-100/10 to-neutral-400/20
      isolate
      backdrop-blur-[2px]
      ring-2
      ring-inset
      ring-white/10
      [clip-path:_polygon(2%_2%,_100%_4%,_98%_100%,_2%_96%)]
      after:flex
      after:absolute
      after:h-8
      after:blur-sm
      after:rotate-45
      after:rounded-full
      after:w-0.5
      after:bg-gradient-to-b
      after:from-white
      after:to-transparent
      after:right-2
      after:-top-2
      after:z-10
      before:flex
      before:absolute
      before:h-8
      before:blur-sm
      before:rotate-45
      before:rounded-full
      before:w-4
      before:bg-gradient-to-b
      before:from-white/20
      before:to-transparent
      before:left-2
      before:-bottom-2
      before:z-10
    `,
    variants: {
      size: {
        1: "w-20 h-10",
        2: "w-24 h-12",
        3: "w-28 h-16",
        4: "w-20 h-10",
        5: "w-24 h-10",
        6: "w-28 h-10",
        7: "w-24 h-12",
        8: "w-28 h-12",
        9: "w-32 h-12",
        10: "w-12 h-12 rounded-full [clip-path:()]",
        11: "w-16 h-16 rounded-full [clip-path:()]",
      },
      rotate: {
        1: "rotate-1",
        2: "rotate-2",
        3: "rotate-3",
        4: "rotate-6",
        5: "-rotate-1",
        6: "-rotate-2",
        7: "-rotate-3",
        8: "-rotate-6",
      },
      translateY: {
        1: "-translate-y-1/2",
        2: "-translate-y-1/3",
        3: "-translate-y-2",
        4: "-translate-y-4",
        5: "-translate-y-6",
      }
    },
    defaultVariants: {
      size: getRandomNumberFromRange(1, 11) as 1 | 2| 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11,
      rotate: getRandomNumberFromRange(1, 8) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      translateY: getRandomNumberFromRange(1, 5) as 1 | 2 | 3 | 4 | 5,
    }
  });

  type TapeProps = {
    compName?: string;
    className?: string;
  } & VariantProps<typeof tvTape>;

  const {
    compName = "Tape",
    className,
    size,
    rotate,
    translateY
  }: TapeProps = $props();

</script>
<div data-comp={compName} class={tvTape({ size, rotate, translateY, className })} aria-hidden="true"></div>
