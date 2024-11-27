<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvHeadline = tv({
    base: "text-balance font-extrabold",
    variants: {
      preset: {
        h1: "text-4xl",
        h2: "text-3xl",
        h3: "text-2xl",
        h4: "text-xl",
        h5: "text-lg",
        h6: "text-base",
      },
      size: {
        "11xl": "text-11xl",
        "10xl": "text-10xl",
        "9xl": "text-9xl",
        "8xl": "text-8xl",
        "7xl": "text-7xl",
        "6xl": "text-6xl",
        "5xl": "text-5xl",
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
        thin: "font-thin",
        extralight: "font-extralight",
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
        black: "font-black",
      },
      family: {
        decorative: "font-decorative",
        sans: "font-sans",
        serif: "font-serif",
        mono: "font-mono",
      },
    },
    defaultVariants: {
      preset: "h2",
      family: "serif"
    },
  });

  type HeadlineTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  type HeadlineProps = {
      compName?: string;
      tag?: HeadlineTags;
      text: string;
      className?: string;
  } & VariantProps<typeof tvHeadline>;

  const {
    compName = "Headline",
    tag = "h2",
    text,
    preset,
    size,
    weight,
    family,
    className,
    ...rest
  }: HeadlineProps = $props();
</script>

{#if text}
  <svelte:element
    this={tag}
    data-comp={compName}
    class={tvHeadline({ preset, size, weight, family, className })}
    {...rest}
  >
    {text}
  </svelte:element>
{/if}
