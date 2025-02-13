<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
  }
  let { children }: Props = $props();
</script>

<main
  class="w-full lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80 overflow-clip"
  data-theme="dark"
>
  {@render children?.()}
</main>

<style>
  @reference "tailwindcss/theme";
  main::before {
    content: "";
    background-color: var(--color-neutral-300);
    background-attachment: fixed;
    inset: 0;
    position: fixed;
    z-index: -10;
    background-image: url($lib/images/bg-triangle-gray.avif);
  }
  main::after {
    content: "";
    background-color: var(--color-neutral-900);

    @media (width >= theme(--breakpoint-lg)) {
      max-width: min(calc(100% - 4vw), 2000px);
    }
    isolation: isolate;
    backdrop-filter: blur(var(--blur-sm));
    position: fixed;
    top: 0;
    height: 100dvh;
    z-index: -10;
    width: 100%;
    left: 50%;
    translate: -50% 0;
    box-shadow:
      rgba(255, 255, 255, 1) 0 0 0 0,
      rgba(255, 255, 255, 1) 0 0 0 1px,
      rgba(0, 0, 0, 0) 0 0 0 0;
  }
</style>
