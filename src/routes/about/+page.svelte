<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Image from "$components/image/Image.svelte";
  import DecorativeWrapper from "$components/wrapper/DecorativeWrapper.svelte";
  import CurriculumVitae from "$components/block/CurriculumVitae.svelte";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let entry = $derived(getFirstEntry(data.entries));

  const cc = {
    main: "w-full lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80 overflow-clip",
    heroImage: "absolute inset-x-0 top-0 z-10",
    heroHeadline: "font-decorative text-7xl font-extrabold uppercase !leading-[0.85] [font-size:min(12vw,13.5rem)] text-olkch-yellow -translate-y-[1.75cap] -mb-[1.25cap] flex flex-wrap [br]:w-full",
    heroRichText: "is-zoomInUp span-content lg:col-start-2 lg:col-end-10 text-white text-3xl max-w-prose",
    decorativeWrapper: "span-popout px-fluid relative z-20  mt-[16vw] pb-32",
  };
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryAbout_Entry"}
  <main class={cc.main}>
    {#if entry?.heroImage}
      <Image className={cc.heroImage} animate="fade" ratio="aspect-auto" noscript={false} image={entry?.heroImage[0]} />
    {/if}
    <div class="fluid-grid">
      <DecorativeWrapper preset="glass-home" className={cc.decorativeWrapper}>
        {#if entry?.customTitle}
          <div class={cc.heroHeadline} use:useWaypoint data-waypoint>
            {@html splitTextIntoDivs(entry?.customTitle, "is-blurInLeftDown", "$")}
          </div>
        {/if}

        {#if entry?.description}
          <div use:useWaypoint={{delay: 1000}} data-waypoint class="grid grid-cols-12">
            <RichText data-waypoint-target className={cc.heroRichText} html={entry?.description} />
          </div>
        {/if}
      </DecorativeWrapper>

      {#if entry?.curriculumVitae}
        <CurriculumVitae items={entry.curriculumVitae} className="span-content z-10" />
      {/if}
    </div>
  </main>
{/if}

<style lang="postcss">
  :global(body) {
    background-color: theme("colors.neutral.300");
    background-image: url($lib/images/bg-triangle-gray.png);
    background-attachment: fixed;
  }

  main::after {
    content: "";
    isolation: isolate;
    background-color: theme("colors.neutral.900");
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
