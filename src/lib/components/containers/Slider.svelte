<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvSlider = tv({
    base: ""
  });

  type SliderProps = {
    compName?: string;
    className?: string;
    children: Snippet;
  } & VariantProps<typeof tvSlider>;

  let { compName = "Slider", className, children }: SliderProps = $props();

</script>

{#if children}
  <div class={tvSlider({ className })} data-comp={compName}>
    {@render children()}
  </div>
{/if}
