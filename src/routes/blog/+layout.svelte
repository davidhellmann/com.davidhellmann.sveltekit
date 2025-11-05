<script lang="ts">
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<main
  use:useWaypoint={{ staggeringDelay: 100 }}
  data-waypoint
  class="fluid-grid lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80"
>
  {@render children?.()}
</main>

<style>
  @reference "../../lib/styles/app.css";
  main::before {
    content: "";
    background-attachment: fixed;
    background-color: #d5d3d1;
    inset: 0;
    position: fixed;
    z-index: -10;
    background-image: url($lib/images/bg-triangle-beige.avif);
  }

  main::after {
    content: "";
    isolation: isolate;
    backdrop-filter: blur(8px);
    background-color: rgba(231, 229, 228, 0.9);
    box-shadow:
      rgb(255, 255, 255) 0 0 0 0,
      rgba(255, 255, 255, 0.8) 0 0 0 1px,
      rgba(0, 0, 0, 0) 0 0 0 0;
    position: fixed;
    top: 0;
    height: 100dvh;
    z-index: -1;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);

    @media (width >= theme(--breakpoint-lg)) {
      max-width: min(calc(100% - 4vw), 2000px);
    }
  }
</style>
