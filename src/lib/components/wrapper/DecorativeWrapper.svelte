<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvDecorativeWrapper = tv({
    base: "",
    variants: {
      preset: {
        unset: "",
        "glass-white": `
          isolate relative z-10 bg-white/50 backdrop-blur shadow-md ring-1 ring-black/5 rounded-3xl
        `,
        "glass-home": `
          isolate relative z-10 lin bg-gradient-to-b from-transparent to-neutral-900/10 backdrop-blur-lg ring-1 ring-black/5 rounded-3xl
        `,
      },
    },
    defaultVariants: {
      preset: "glass-white"
    }
  });

  type DecorativeWrapperProps = {
    compName?: string;
    className?: string | undefined;
    children: Snippet;
  } & VariantProps<typeof tvDecorativeWrapper>;

  const {
    compName = "DecorativeWrapper",
    className,
    preset,
    children,
  }: DecorativeWrapperProps = $props();
</script>

{#if children}
  <div
    data-comp={compName}
    class={tvDecorativeWrapper({ preset, className })}
  >
    {@render children()}
  </div>
{/if}
