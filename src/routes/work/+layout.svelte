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
  data-theme="dark"
>
  {@render children?.()}
</main>

<style>
  @reference "../../lib/styles/app.css";
  main::before {
    content: "";
    @apply bg-neutral-900 bg-fixed inset-0 fixed -z-10;
  }
  main::after {
    content: "";
    @apply bg-neutral-950 lg:max-w-[min(calc(100%-4vw),2000px)]
    isolate backdrop-blur-sm fixed top-0 h-[100dvh] -z-10 w-full left-1/2 transform -translate-x-1/2;
    box-shadow:
      rgba(0, 0, 0, 1) 0 0 0 0,
      rgba(0, 0, 0, 1) 0 0 0 1px,
      rgba(0, 0, 0, 0) 0 0 0 0;
  }
</style>
