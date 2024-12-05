<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvInlineSvg = tv({
    base: "[&>svg]:w-full [&>svg]:h-auto"
  });

  type InlineSvgProps = {
    compName?: string;
    className?: string;
    svgCode: string;
  } & VariantProps<typeof tvInlineSvg>;

  const { compName = "InlineSvg", className, svgCode = "" }: InlineSvgProps = $props();
</script>

{#if svgCode}
  <div class={tvInlineSvg({ className })} data-comp={compName} data-waypoint-target>
    <!-- eslint-disable-next-line -->
    {@html svgCode}
  </div>
{/if}
