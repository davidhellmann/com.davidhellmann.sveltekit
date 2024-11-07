<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import Headline from "$components/text/Headline.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let entry = $derived(getFirstEntry(data.entries));
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

<main class="fluid-grid max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80">
  <div class="span-content">
    {#if entry?.title}
      <Headline text={entry?.title} />
    {/if}
  </div>
</main>

<style lang="postcss">
  :global(body) {
    background-color: #d5d3d1;
    background-image: url($lib/images/bg-triangle-gray.png);
    background-attachment: fixed;
  }
  main::after {
    content: "";
    isolation: isolate;
    background-color: rgba(231, 229, 228, 0.9);
    backdrop-filter: blur(8px);
    box-shadow:
      rgb(255, 255, 255) 0 0 0 0,
      rgba(255, 255, 255, 0.8) 0 0 0 1px,
      rgba(0, 0, 0, 0) 0 0 0 0;
    position: fixed;
    height: 100dvh;
    z-index: -1;
    width: 100%;
    max-width: min(calc(100% - 4vw), 2000px);
    left: 50%;
    transform: translateX(-50%);
  }
</style>
