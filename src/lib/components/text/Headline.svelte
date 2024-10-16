<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvHeadline = tv({
    base: "font-serif text-balance text-neutral-500",
    variants: {
      preset: {
        h1: "text-7xl font-extrabold",
        h2: "text-3xl font-extrabold",
        h3: "text-2xl font-extrabold",
        h4: "text-xl font-extrabold",
        h5: "text-lg font-extrabold",
        h6: "text-base font-extrabold",
      },
      size: {
        "4xl": "text-4xl",
        "3xl": "text-3xl",
        "2xl": "text-2xl",
        xl: "text-xl",
        lg: "text-lg",
        base: "text-base",
        sm: "text-sm",
        xs: "text-xs",
        "2xs": "text-2xs",
        "3xs": "text-3xs",
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        semibold: "font-semibold",
        extrabold: "font-extrabold",
      },
    },
    defaultVariants: {
      preset: "h2",
    },
  });

  type HeadlineTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  type HeadlineProps = {
      compName?: string;
      tag?: HeadlineTags;
      text: string;
      className?: string;
  } & HTMLHeadingElement & VariantProps<typeof tvHeadline>;

  const {
    compName = "Headline",
    tag = "h2",
    text,
    preset,
    size,
    weight,
    className
  }: HeadlineProps = $props();
</script>

{#if text}
  <svelte:element
    this={tag}
    data-comp={compName}
    class={tvHeadline({ preset, size, weight, className })}
  >
    {text}
  </svelte:element>
{/if}
