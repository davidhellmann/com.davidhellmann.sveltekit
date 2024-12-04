<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import { onMount } from "svelte";

  const tvInlineSvg = tv({
    base: "[&>svg]:w-full [&>svg]:h-auto"
  });

  type InlineSvgProps = {
    compName?: string;
    className?: string;
    url: string;
  } & VariantProps<typeof tvInlineSvg>;

  const { compName = "InlineSvg", className, url = "" }: InlineSvgProps = $props();

  let svgCode = $state("");
  onMount(async () => {
    const response = await fetch(`/api/svg?svgUrl=${encodeURIComponent(url)}`);
    if (response.ok) {
      svgCode = await response.text();
    } else {
      console.error("Failed to fetch SVG:", response.statusText);
    }
  });
</script>

{#if svgCode}
  <div class={tvInlineSvg({ className })} data-comp={compName} data-waypoint-target>
    <!-- eslint-disable-next-line -->
    {@html svgCode}
  </div>
{/if}
