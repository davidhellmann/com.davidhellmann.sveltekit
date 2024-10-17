<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Caption from "$components/text/Caption.svelte";
  import type{  Snippet } from "svelte";

  const tvFigure = tv({
    slots: {
      figure: "flex flex-col gap-2",
      figcaption: "",
    },
    variants: {
      variant: {
        default: {
          figure: ""
        },
        boxed: {
          figure: "bg-neutral-200 px-4 pt-4 pb-3 rounded-md"
        }
      }
    },
    defaultVariants: {
      variant: "default"
    }
  });

  type FigureProps = {
    compName?: string;
    className?: string;
    headline?: string;
    text?: string;
    source?: string;
    sourceUrl?: string;
    children?: Snippet;
  } & VariantProps<typeof tvFigure>;

  const {
    compName = "Figure",
    className,
    headline,
    text,
    source,
    sourceUrl,
    children,
    variant
  }: FigureProps = $props();

  const { figure, figcaption } = tvFigure({ variant, className });
</script>

<figure
  data-comp={compName}
  class={figure({ variant, className })}
>
  {@render children?.()}
  {#if text}
    <Caption
      text={text}
      headline={headline}
      source={source}
      sourceUrl={sourceUrl}
      className={figcaption()}
    />
  {/if}
</figure>
