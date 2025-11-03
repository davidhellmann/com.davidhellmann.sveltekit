<script lang="ts">
  import type { PageProps } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { type EntryType_AboutFragment } from "$graphql/graphql";
  import Seo from "$components/seo/Seo.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Headline from "$components/text/Headline.svelte";
  import Image from "$components/media/Image.svelte";
  import AboutSlider from "$components/sections/AboutSlider.svelte";
  import Glass from "$components/decorative/Glass.svelte";
  import CurriculumVitae from "$components/sections/CurriculumVitae.svelte";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useJumpingLetters } from "$lib/actions/action.jumpingLetters";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";

  let { data }: PageProps = $props();
  let entry = getFirstEntry(data.entries) as EntryType_AboutFragment;

  const cc = {
    heroImage: "absolute inset-x-0 top-0 z-10 aspect-auto!",
    heroHeadline:
      "font-decorative text-7xl font-extrabold uppercase leading-[0.85]! `text-[min(12vw,13.5rem)] text-neon-yellow -translate-y-[1.75cap] -mb-[1.25cap] flex flex-wrap [br]:w-full",
    heroSubline: "is-fadeInUp span-content lg:col-start-2 lg:col-end-10 text-white text-3xl max-w-prose",
    heroRichText:
      "is-fadeInUp mt-12 span-content lg:col-start-2 md:columns-2 gap-fluid lg:col-end-10 text-white text max-w-prose",
    glass: "span-popout px-fluid relative z-20  mt-[16vw] pb-32"
  };

  let letters = $derived(splitTextIntoDivs(entry?.customTitle, "is-blurInLeftDown", "$"));
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry?.heroImage}
  <Image className={cc.heroImage} lazy={false} noscript={false} image={entry?.heroImage[0]} />
{/if}
<div class="fluid-grid">
  <Glass preset="glass-home" className={cc.glass}>
    {#if entry?.customTitle}
      <div class={cc.heroHeadline} use:useWaypoint data-waypoint use:useJumpingLetters>
        <!-- eslint-disable-next-line -->
        {@html letters}
      </div>
    {/if}

    {#if entry?.description}
      <div use:useWaypoint={{ delay: 700, staggeringDelay: 100 }} data-waypoint class="grid grid-cols-12">
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
    <Headline className={"span-xl z-10 pb-12"} text={"Working experience"} />
    <CurriculumVitae items={entry.curriculumVitae} className="span-content z-10" />
  {/if}
</div>
