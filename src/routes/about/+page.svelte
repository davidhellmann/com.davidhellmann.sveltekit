<script lang="ts">
  import type { PageProps } from "./$types";
  import Seo from "$components/seo/Seo.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Headline from "$components/text/Headline.svelte";
  import Image from "$components/media/Image.svelte";
  import AboutSlider from "$components/sections/AboutSlider.svelte";
  import Glass from "$components/decorative/Glass.svelte";
  import CurriculumVitae from "$components/sections/CurriculumVitae.svelte";
  import { useSplitText } from "$lib/actions/action.splitText";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  let { data }: PageProps = $props();
  let entry = $derived(data.entry);

  const cc = {
    heroImage: "absolute inset-x-0 top-0 z-10",
    heroHeadline:
      "font-decorative text-7xl font-extrabold uppercase leading-[0.85]! `text-[min(12vw,13.5rem)] text-neon-yellow -translate-y-[1.75cap] -mb-[1.25cap]",
    heroSubline: "is-fadeInUp span-content lg:col-start-2 lg:col-end-10 text-white text-3xl max-w-prose",
    heroRichText:
      "is-fadeInUp mt-12 span-content lg:col-start-2 md:columns-2 gap-fluid lg:col-end-10 text-white text max-w-prose",
    glass: "span-popout px-fluid relative z-20  mt-[16vw] pb-32"
  };
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry?.heroImage}
  <Image
    className={cc.heroImage}
    lazy={false}
    fetchPriority="high"
    preload={true}
    noscript={false}
    image={entry?.heroImage[0]}
    sizes="(min-width: 2000px) 1800px, (min-width: 1024px) calc(100vw - 4vw), 100vw"
  />
{/if}
<div class="fluid-grid">
  <Glass preset="glass-home" className={cc.glass}>
    {#if entry?.customTitle}
      <h1 data-split-text hidden class={cc.heroHeadline} use:useSplitText={{ direction: "fromTop" }}>
        {#each entry.customTitle.split("$") as line, index (`${line}-${index}`)}
          {#if index > 0}<br />{/if}
          {line}
        {/each}
      </h1>
    {/if}

    {#if entry?.description}
      <div use:useWaypoint={{ delay: 600, staggeringDelay: 100 }} data-waypoint class="grid grid-cols-12">
        <RichText data-waypoint-target className={cc.heroSubline} html={entry?.description} />
        <RichText data-waypoint-target className={cc.heroRichText} html={entry?.aboutMeRichText} />
      </div>
    {/if}
  </Glass>

  {#if entry?.imageSliderI && entry?.sliderHeadingI}
    <AboutSlider
      className="z-10"
      images={entry?.imageSliderI}
      headline={entry?.sliderHeadingI}
      html={entry?.sliderRichTextI}
    />
  {/if}

  {#if entry?.imageSliderII && entry?.sliderHeadingII}
    <AboutSlider
      autoScrollOptions={{ direction: "backward" }}
      images={entry?.imageSliderII}
      headline={entry?.sliderHeadingII}
      html={entry?.sliderRichTextII}
    />
  {/if}

  {#if entry?.imageSliderIII && entry?.sliderHeadingIII}
    <AboutSlider images={entry?.imageSliderIII} headline={entry?.sliderHeadingIII} html={entry?.sliderRichTextIII} />
  {/if}

  {#if entry?.curriculumVitae}
    <Headline className="span-xl z-10 pb-12" text="Working experience" />
    <CurriculumVitae items={entry.curriculumVitae} className="span-content z-10" />
  {/if}
</div>
