<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import { type Snippet } from "svelte";

  const tvGrid = tv({
    base: "grid",
    variants: {
      columns: {
        1: "grid-cols-1",
        2: "grid-cols-1 @3xl:grid-cols-2",
        3: "grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3",
        4: "grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4",
        5: "grid-cols-2 @lg:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5",
        6: "grid-cols-2 @lg:grid-cols-4 @3xl:grid-cols-6",
        cards: "grid-cols-cards",
        "cards-small": "grid-cols-cards-small",
        "cards-medium": "grid-cols-cards-medium",
        "cards-large": "grid-cols-cards-large",
        "image-gallery": `
          grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2
          [&>img]:h-full
          [&>img:nth-child(1)]:col-span-1 md:[&>img:nth-child(1)]:col-span-2 [&>img:nth-child(1)]:row-span-1 md:[&>img:nth-child(1)]:row-span-2
          [&>img:nth-child(2)]:col-span-1 [&>img:nth-child(2)]:row-span-1
          [&>img:nth-child(3)]:col-span-2 md:[&>img:nth-child(3)]:col-span-1 [&>img:nth-child(3)]:row-span-2 md:[&>img:nth-child(3)]:row-span-1
        `,
      },
      gap: {
        unset: "",
        0: "gap-0",
        4: "gap-4",
        8: "gap-8",
        16: "gap-16",
        32: "gap-32",
        fluid: "gap-fluid",
      },
      gapX: {
        unset: "",
        0: "gap-x-0",
        4: "gap-x-4",
        8: "gap-x-8",
        16: "gap-x-16",
        32: "gap-x-32",
        fluid: "gap-x-fluid",
      },
      gapY: {
        unset: "",
        0: "gap-y-0",
        4: "gap-y-4",
        8: "gap-y-8",
        16: "gap-y-16",
        32: "gap-y-32",
        fluid: "gap-y-fluid",
      },
    },
  });

  type GridProps = {
    compName?: string;
    className?: string;
    children: Snippet;
  } & VariantProps<typeof tvGrid>;

  let {
    compName = "Grid",
    className,
    columns = 3,
    gap = "fluid",
    gapX = "unset",
    gapY = "unset",
    children,
  }: GridProps = $props();

  if (gapX !== "unset" || gapY !== "unset") {
    gap = "unset";
  }
</script>

{#if children}
  <div
    data-comp={compName}
    class={tvGrid({ columns, gap, gapX, gapY, className })}
  >
    {@render children()}
  </div>
{/if}
