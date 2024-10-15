<script lang="ts">
  import "@fontsource-variable/bitter";
  import "@fontsource-variable/inter";
  import "$styles/app.css";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

{@render children?.()}
