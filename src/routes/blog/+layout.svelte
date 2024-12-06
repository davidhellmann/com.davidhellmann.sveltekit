<script lang="ts">
  import { useWaypoint } from "$lib/actions/action.waypoint";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<main
  use:useWaypoint={{ staggeringDelay: 100 }}
  data-waypoint
  class="fluid-grid lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80"
>
  {@render children?.()}
</main>

<style lang="postcss">
  main::before {
    content: "";
    @apply bg-fixed bg-[#d5d3d1] inset-0 fixed z-behind;
    background-image: url($lib/images/bg-triangle-beige.avif);
  }
  main::after {
    content: "";
    @apply lg:max-w-[min(calc(100%-4vw),2000px)]
    isolate backdrop-blur fixed top-0 h-[100dvh] z-behind w-full left-1/2 transform -translate-x-1/2;
    background-color: rgba(231, 229, 228, 0.9);
    box-shadow:
      rgb(255, 255, 255) 0 0 0 0,
      rgba(255, 255, 255, 0.8) 0 0 0 1px,
      rgba(0, 0, 0, 0) 0 0 0 0;
  }
</style>
