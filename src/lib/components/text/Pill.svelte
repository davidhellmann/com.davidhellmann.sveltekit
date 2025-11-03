<script lang="ts">
  import { tv, type VariantProps } from "$lib/utils/classNames";

  const tvPill = tv({
    base: "tracking-widest text-xs rounded-full",
    variants: {
      color: {
        pink: "bg-accent-pink-500 text-white"
      },
      size: {
        sm: "px-2 py-1",
        base: "px-3 py-1.5",
        lg: "px-4 py-2"
      },
      textTransform: {
        uppercase: "uppercase",
        normal: "normal-case"
      }
    },
    defaultVariants: {
      color: "pink",
      size: "lg",
      textTransform: "uppercase"
    }
  });

  type PillProps = {
    compName?: string;
    className?: string;
    text: string;
    url?: string;
  } & VariantProps<typeof tvPill>;

  const { compName = "Pill", className, text, url, color, size, textTransform }: PillProps = $props();
</script>

{#if text}
  <svelte:element
    this={url ? "a" : "span"}
    href={url ? url : undefined}
    data-comp={compName}
    class={tvPill({ color, size, textTransform, className })}
  >
    {text}
  </svelte:element>
{/if}
