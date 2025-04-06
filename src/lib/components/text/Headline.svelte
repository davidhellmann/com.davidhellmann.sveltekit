<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

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

  type HeadlineProps = {
    compName?: string;
    tag?: HeadlineTags;
    text: string;
    className?: string;
  } & VariantProps<typeof tvHeadline>;

  const { compName = "Headline", tag = "h2", text, preset, family, className, ...rest }: HeadlineProps = $props();
</script>

{#if text}
  <svelte:element this={tag} data-comp={compName} class={tvHeadline({ preset, family, className })} {...rest}>
    {text}
  </svelte:element>
{/if}
