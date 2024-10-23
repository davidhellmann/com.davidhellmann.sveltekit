<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Caption from "$components/text/Caption.svelte";
  import RichText from "$components/text/RichText.svelte";
  import type{  Snippet } from "svelte";

  const tvFigure = tv({
    slots: {
      slotFigure: "flex flex-col gap-fluid",
      slotFigcaption: "",
      slotRichText: "text-sm",
    },
    variants: {
      variant: {
        default: {
          slotFigure: ""
        },
        boxed: {
          slotFigure: "bg-neutral-300/60 rounded-3xl",
          slotFigcaption: "pb-fluid px-fluid",
          slotRichText: "pb-fluid px-fluid",
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

<figure
  data-comp={compName}
  class={slotFigure({ variant, className })}
>
  {@render children?.()}
  {#if text}
    <Caption
      text={text}
      headline={headline}
      source={source}
      sourceUrl={sourceUrl}
      className={slotFigcaption()}
    />
  {:else if html}
    <RichText html={html} className={slotRichText()} />
  {/if}
</figure>
