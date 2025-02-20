<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvEmblaSlide = tv({
    base: "shrink-0",
    variants: {
      width: {
        full: "w-full",
        half: "w-1/2",
        third: "w-1/3",
        quarter: "w-1/4",
        fifth: "w-1/5"
      },
      gap: {
        unset: "",
        0: "mr-0",
        4: "mr-4",
        8: "mr-8",
        16: "mr-16",
        32: "mr-32",
        fluid: "mr-fluid"
      }
    },
    defaultVariants: {
      width: "third",
      gap: "fluid"
    }
  });

  type EmblaSlideProps = {
    compName?: string;
    className?: string;
    children: Snippet;
    index?: number;
  } & VariantProps<typeof tvEmblaSlide>;

  let { compName = "EmblaSlide", width, gap, className, index, children }: EmblaSlideProps = $props();

  const getMarginClass = (index: number | null) => {
    if (!index) return "";
    const count = Math.floor(Math.random() * 4);
    return index % 2 === 0
      ? ["mt-8", "mt-12", "mt-16", "mt-20"][count]
      : ["-mt-8", "-mt-12", "-mt-16", "-mt-20"][count];
  };
</script>

{#if children}
  <div class={[getMarginClass(index ?? null), tvEmblaSlide({ width, gap, className })]} data-comp={compName}>
    {@render children()}
  </div>
{/if}
