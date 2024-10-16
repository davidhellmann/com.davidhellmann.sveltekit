<script lang="ts">
  import { lazyLoad } from "unlazy";
  import { onMount } from "svelte";
  import "@fontsource-variable/bitter";
  import "@fontsource-variable/inter";
  import "$styles/app.css";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  onMount(() => {
    lazyLoad();
  });
</script>

{@render children?.()}
