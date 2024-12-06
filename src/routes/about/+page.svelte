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
    heroImage: "absolute inset-x-0 top-0 z-10",
    heroHeadline:
      "font-decorative text-7xl font-extrabold uppercase !leading-[0.85] [font-size:min(12vw,13.5rem)] text-olkch-yellow -translate-y-[1.75cap] -mb-[1.25cap] flex flex-wrap [br]:w-full",
    heroRichText: "is-fadeInUp span-content lg:col-start-2 lg:col-end-10 text-white text-3xl max-w-prose",
    decorativeWrapper: "span-popout px-fluid relative z-20  mt-[16vw] pb-32"
  };
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryAbout_Entry"}
  {#if entry?.heroImage}
    <Image className={cc.heroImage} lazy={false} ratio="aspect-auto" noscript={false} image={entry?.heroImage[0]} />
  {/if}
  <div class="fluid-grid">
    <DecorativeWrapper preset="glass-home" className={cc.decorativeWrapper}>
      {#if entry?.customTitle}
        <div class={cc.heroHeadline} use:useWaypoint data-waypoint>
          <!-- eslint-disable-next-line -->
          {@html splitTextIntoDivs(entry?.customTitle, "is-blurInLeftDown", "$")}
        </div>
      {/if}

      {#if entry?.description}
        <div use:useWaypoint={{ delay: 700 }} data-waypoint class="grid grid-cols-12">
          <RichText data-waypoint-target className={cc.heroRichText} html={entry?.description} />
        </div>
      {/if}
    </DecorativeWrapper>

    {#if entry?.curriculumVitae}
      <CurriculumVitae items={entry.curriculumVitae} className="span-content z-10" />
    {/if}
  </div>
{/if}
