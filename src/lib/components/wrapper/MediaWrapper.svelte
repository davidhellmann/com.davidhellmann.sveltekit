<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvMediaWrapper = tv({
    base: "",
    variants: {
      preset: {
        unset: "",
        "glass-white": `
          isolate relative z-10 bg-white/50 backdrop-blur shadow-md ring-1 ring-black/5 rounded-3xl
        `,
      },
    },
    defaultVariants: {
      preset: "glass-white"
    }
  });

  type MediaWrapperProps = {
    compName?: string;
    className?: string | undefined;
    children: Snippet;
  } & VariantProps<typeof tvMediaWrapper>;

  const {
    compName = "MediaWrapper",
    className,
    preset,
    children,
  }: MediaWrapperProps = $props();
</script>

{#if children}
  <div
    data-comp={compName}
    class={tvMediaWrapper({ preset, className })}
  >
    {@render children()}
  </div>
{/if}
