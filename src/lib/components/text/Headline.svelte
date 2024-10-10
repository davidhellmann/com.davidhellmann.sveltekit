<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvHeadline = tv({
    base: "",
    variants: {
      preset: {
        h1: "text-4xl font-extrabold",
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
  });

  type HeadlineTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  export let compName = "Headline";
  export let tag: HeadlineTags = "h2";
  export let text: string;
  export let preset: VariantProps<typeof tvHeadline>["preset"] = "h2";
  export let size: VariantProps<typeof tvHeadline>["size"];
  export let weight: VariantProps<typeof tvHeadline>["weight"];
  export let className = "";
</script>

{#if text}
  <svelte:element
    this={tag}
    data-comp={compName}
    data-testid={compName}
    class={tvHeadline({ preset, size, weight, className })}
  >
    {text}
  </svelte:element>
{/if}
