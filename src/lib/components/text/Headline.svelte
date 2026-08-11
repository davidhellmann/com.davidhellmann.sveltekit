<script lang="ts">
  import type { Action } from "svelte/action";
  import { tv, type VariantProps } from "$utils/classNames";
  import type { SplitTextOptions } from "$lib/actions/action.splitText";

  const tvHeadline = tv({
    base: "text-balance ",
    variants: {
      preset: {
        h1: "text-4xl font-extrabold",
        h2: "text-3xl font-extrabold",
        h3: "text-2xl font-extrabold",
        h4: "text-xl font-extrabold",
        h5: "text-lg font-extrabold",
        h6: "text-base font-extrabold"
      },
      family: {
        decorative: "font-decorative",
        sans: "font-sans",
        serif: "font-serif",
        mono: "font-mono"
      }
    },
    defaultVariants: {
      preset: "h2",
      family: "serif"
    }
  });

  type HeadlineTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  type SplitTextAction = Action<HTMLElement, SplitTextOptions | undefined>;

  const noAction: SplitTextAction = () => {};

  type HeadlineProps = {
    compName?: string;
    tag?: HeadlineTags;
    text?: string;
    className?: string;
    splitTextAction?: SplitTextAction;
    splitText?: SplitTextOptions;
  } & VariantProps<typeof tvHeadline>;

  const {
    compName = "Headline",
    tag = "h2",
    text,
    preset,
    family,
    className,
    splitTextAction = noAction,
    splitText,
    ...rest
  }: HeadlineProps = $props();

  let hasSplitText = $derived(splitTextAction !== noAction);
</script>

{#if text}
  <svelte:element
    this={tag}
    data-comp={compName}
    data-split-text={hasSplitText ? "" : undefined}
    hidden={hasSplitText}
    class={tvHeadline({ preset, family, className })}
    use:splitTextAction={splitText}
    {...rest}
  >
    {text}
  </svelte:element>
{/if}
