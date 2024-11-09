<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Image from "$components/image/Image.svelte";
  import DecorativeWrapper from "$components/wrapper/DecorativeWrapper.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let entry = $derived(getFirstEntry(data.entries));
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryHome_Entry"}
  <main class="w-full max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80">
    {#if entry?.heroImage}
      <Image className="absolute inset-x-0 top-0 z-10" ratio="aspect-auto" noscript={false}
             image={entry?.heroImage[0]} />
    {/if}
    <div class="fluid-grid">
      <DecorativeWrapper preset="glass-home" className="span-popout px-fluid relative z-20  mt-[16vw] pb-32">
          {#if entry?.customTitle}
            <Headline
              family="sans"
              size="6xl"
              className="!leading-[0.85] [font-size:min(12vw,13.5rem)] text-olkch-green -translate-y-[1.75cap] -mb-[1.25cap]"
              text={entry?.customTitle} />
          {/if}


          {#if entry?.description}
            <div class="grid grid-cols-12">
              <RichText className="col-start-2 col-end-10 text-white text-3xl max-w-prose" html={entry?.description} />
            </div>
          {/if}
      </DecorativeWrapper>
    </div>
  </main>
{/if}


<style lang="postcss">
  :global(body) {
    background-color: #d5d3d1;
    background-image: url($lib/images/bg-triangle-gray.png);
    background-attachment: fixed;
  }

  main::after {
    content: "";
    isolation: isolate;
    background-color: theme("colors.neutral.900");
    backdrop-filter: blur(8px);
    box-shadow: rgba(255, 255, 255, 1) 0 0 0 0,
    rgba(255, 255, 255, 1) 0 0 0 1px,
    rgba(0, 0, 0, 0) 0 0 0 0;
    position: fixed;
    top: 0;
    height: 100dvh;
    z-index: -1;
    width: 100%;
    max-width: min(calc(100% - 4vw), 2000px);
    left: 50%;
    transform: translateX(-50%);
  }
</style>
