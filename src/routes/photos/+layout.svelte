<script lang="ts">
  import { useWaypoint } from "$lib/actions/action.waypoint";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<main class="fluid-grid mx-auto relative z-10 stack-24 pt-40 lg:pt-80 bg-white" use:useWaypoint data-waypoint>
  {@render children?.()}
</main>

<style>
  :global(body) {
    background-color: var(--color-white) !important;
  }
</style>
