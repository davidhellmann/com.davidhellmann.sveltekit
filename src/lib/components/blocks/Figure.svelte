<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Caption from "$components/text/Caption.svelte";
  import RichText from "$components/text/RichText.svelte";
  import type { Snippet } from "svelte";

  const tvFigure = tv({
    slots: {
      slotFigure: "flex flex-col gap-8 md:gap-fluid",
      slotFigcaption: "",
      slotRichText: "text-sm"
    },
    variants: {
      variant: {
        default: {
          slotFigure: ""
        },
        boxed: {
          slotFigure: "bg-neutral-300/60 rounded-3xl",
          slotFigcaption: "pb-8 md:pb-fluid px-8 md:px-fluid",
          slotRichText: "pb-8 md:pb-fluid px-8 md:px-fluid"
        }
      }
    },
    defaultVariants: {
      variant: "boxed"
    }
  });

  type FigureProps = {
    compName?: string;
    className?: string;
    headline?: string;
    text?: string;
    source?: string;
    sourceUrl?: string;
    html?: string;
    children?: Snippet;
  } & VariantProps<typeof tvFigure>;

  const {
    compName = "Figure",
    className,
    headline,
    text,
    source,
    sourceUrl,
    html,
    children,
    variant
  }: FigureProps = $props();

  const { slotFigure, slotFigcaption, slotRichText } = tvFigure({ variant, className });
</script>

<figure data-comp={compName} class={slotFigure({ variant, className })}>
  {@render children?.()}
  {#if text}
    <Caption {text} {headline} {source} {sourceUrl} className={slotFigcaption()} />
  {:else if html}
    <RichText {html} className={slotRichText()} />
  {/if}
</figure>
