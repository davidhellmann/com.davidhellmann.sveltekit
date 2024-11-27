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
  :global(body) {
    @apply bg-neutral-300 !important;
    background-image: url($lib/images/bg-triangle-gray.png);
    background-attachment: fixed;
  }

  main::after {
    @apply bg-neutral-900 !important;
    content: "";
    isolation: isolate;
    backdrop-filter: blur(8px);
    box-shadow:
      rgba(255, 255, 255, 1) 0 0 0 0,
      rgba(255, 255, 255, 1) 0 0 0 1px,
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
