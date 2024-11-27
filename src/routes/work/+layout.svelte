<script lang="ts">
  import { useWaypoint } from "$lib/actions/action.waypoint";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<main
  class="fluid-grid lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80"
  use:useWaypoint
  data-waypoint
>
  {@render children?.()}
</main>

<style lang="postcss">
  :global(body) {
    @apply bg-neutral-800 !important;
    background-attachment: fixed;
  }
  main::after {
    @apply bg-neutral-900 !important;
    content: "";
    isolation: isolate;
    backdrop-filter: blur(8px);
    box-shadow:
      rgba(0, 0, 0, 1) 0 0 0 0,
      rgba(0, 0, 0, 1) 0 0 0 1px,
      rgba(0, 0, 0, 0) 0 0 0 0;
    position: fixed;
    top: 0;
    height: 100dvh;
    z-index: -1;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    @apply lg:max-w-[min(calc(100%-4vw),2000px)];
  }
</style>
