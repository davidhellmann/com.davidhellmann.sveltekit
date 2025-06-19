<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvCtaWrapper = tv({
    slots: {
      slotWrapper:
        "isolate relative z-10 bg-gradient-to-b from-neutral-50/20 to-white/50 backdrop-blur-sm ring-4 ring-white/50 rounded-3xl p-4",
      slotInner:
        "bg-gradient-to-b from-accent-purple-400 to-accent-purple-500 ring-8 ring-accent-purple-400/90 rounded-xl px-6 md:px-16 lg:px-24 py-6 md:py-12 lg:py-14 text-white stack-2"
    }
  });

  type CtaWrapperProps = {
    compName?: string;
    className?: string | undefined;
    children: Snippet;
  } & VariantProps<typeof tvCtaWrapper>;

  const { compName = "CtaWrapper", className, children }: CtaWrapperProps = $props();

  const { slotWrapper, slotInner } = tvCtaWrapper({ className });
</script>

{#if children}
  <div data-comp={compName} class={slotWrapper({ className })}>
    <div class={slotInner({})}>
      {@render children()}
    </div>
  </div>
{/if}
