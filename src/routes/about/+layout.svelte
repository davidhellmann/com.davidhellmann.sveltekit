<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
  }
  let { children }: Props = $props();
</script>

<main class="w-full lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80 overflow-clip">
  {@render children?.()}
</main>

<style lang="postcss">
  main::before {
    content: "";
    @apply bg-neutral-300 bg-fixed inset-0 fixed z-behind;
    background-image: url($lib/images/bg-triangle-gray.avif);
  }
  main::after {
    content: "";
    @apply bg-neutral-900 lg:max-w-[min(calc(100%-4vw),2000px)]
    isolate backdrop-blur fixed top-0 h-[100dvh] z-behind w-full left-1/2 transform -translate-x-1/2;
    box-shadow:
      rgba(255, 255, 255, 1) 0 0 0 0,
      rgba(255, 255, 255, 1) 0 0 0 1px,
      rgba(0, 0, 0, 0) 0 0 0 0;
  }
</style>
