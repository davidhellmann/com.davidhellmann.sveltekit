<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvGlass = tv({
    base: "isolate relative z-10 ring-1 ring-black/5 rounded-3xl",
    variants: {
      preset: {
        "glass-white": `
          bg-white/50
          backdrop-blur-sm
          shadow-md
        `,
        "glass-home": `
          bg-gradient-to-b
          from-transparent
          to-neutral-900/10
          backdrop-blur-lg
        `
      }
    },
    defaultVariants: {
      preset: "glass-white"
    }
  });

  type GlassProps = {
    compName?: string;
    className?: string | undefined;
    children: Snippet;
  } & VariantProps<typeof tvGlass>;

  const { compName = "Glass", className, preset, children }: GlassProps = $props();
</script>

{#if children}
  <div data-comp={compName} class={tvGlass({ preset, className })}>
    {@render children()}
  </div>
{/if}
