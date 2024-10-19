<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvMediaWrapper = tv({
    base: "overflow-clip",
    variants: {
      preset: {
        unset: "",
        "glass-white": "isolate bg-white/50 backdrop-blur shadow-md ring-1 ring-black/5",
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
    data-testid={compName}
    class={tvMediaWrapper({ preset, className })}
  >
    {@render children()}
  </div>
{/if}
