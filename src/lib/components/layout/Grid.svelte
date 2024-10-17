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
        "cards-large": "grid-cols-cards-large",
      },
      gap: {
        unset: "",
        0: "gap-0",
        4: "gap-4",
        8: "gap-8",
        16: "gap-16",
        32: "gap-32",
      },
      gapX: {
        unset: "",
        0: "gap-x-0",
        4: "gap-x-4",
        8: "gap-x-8",
        16: "gap-x-16",
        32: "gap-x-32",
      },
      gapY: {
        unset: "",
        0: "gap-y-0",
        4: "gap-y-4",
        8: "gap-y-8",
        16: "gap-y-16",
        32: "gap-y-32",
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
    gap = 8,
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
