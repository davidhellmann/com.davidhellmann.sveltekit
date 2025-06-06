<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Image from "$components/media/Image.svelte";
  import Glass from "$components/decorative/Glass.svelte";
  import GridBentoWork from "$components/containers/GridBentoWork.svelte";
  import { useFullWidthText } from "$lib/actions/action.fullWidthText";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useJumpingLetters } from "$lib/actions/action.jumpingLetters";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";
  import type { ComponentProps } from "svelte";
  import CardBlog from "$components/cards/Blog.svelte";
  import CardPhotos from "$components/cards/Photos.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let entry = $derived(getFirstEntry(data.entries));
  let blogEntries = data?.blogEntries;
  let workEntries = data?.workEntries as ComponentProps<typeof GridBentoWork>["entries"];
  let photoEntries = data?.photoEntries;

  const cc = {
    main: "w-full lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto relative z-10 stack-24 pt-40 lg:pt-80 overflow-clip",
    heroImage: "absolute inset-x-0 top-0 z-10",
    heroHeadline:
      "font-decorative text-7xl font-extrabold !leading-[0.85] [font-size:min(12vw,13.5rem)] text-neon-green -translate-y-[1.75cap] -mb-[1.25cap] flex flex-wrap [br]:w-full",
    heroRichText: "is-fadeInUp span-content lg:col-start-2 lg:col-end-10 text-white text-3xl max-w-prose",
    glass: "span-popout px-fluid relative z-20  mt-[16vw] pb-32",
    bigTextWrapper: "span-full px-4 -mt-48 z-20 pointer-events-none ",
    bigText:
      "uppercase font-decorative bg-gradient-to-b from-neutral-400/10 to-neutral-700/5 py-12 opacity-70 text-transparent bg-clip-text text-center translate-y-full",
    bigTextOverlay: "span-lg z-30 text-neutral-700 -mt-16 pt-4 sm:pt-0 sm:-mt-6 lg:mt-12 -translate-y-full text-4xl",
    cardGrid: "span-content grid gap-8 lg:gap-fluid -mt-6 mb-24 z-10",
    cardGridPhotos: "grid-cols-auto-min-200 xs:grid-cols-auto-min-240 lg:gap-8 items-center"
  };

  let letters = $derived(splitTextIntoDivs(entry?.customTitle, "is-blurInLeftDown", "$"));
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryHome_Entry"}
  <main class={cc.main}>
    {#if entry?.heroImage}
      <Image className={cc.heroImage} lazy={false} ratio="aspect-auto" noscript={false} image={entry?.heroImage[0]} />
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
          <div use:useWaypoint={{ delay: 900 }} data-waypoint class="grid grid-cols-12">
            <RichText data-waypoint-target className={cc.heroRichText} html={entry?.description} />
          </div>
        {/if}
      </Glass>
    </div>

    {#if blogEntries}
      <div class="fluid-grid">
        <div class={cc.bigTextWrapper}>
          <div class={cc.bigText} use:useFullWidthText><span>writing</span></div>
        </div>
        <Headline className={cc.bigTextOverlay} text="blog." />

        <div class="span-content grid grid-cols-1 gap-fluid -mt-6 mb-24 z-10" use:useWaypoint data-waypoint>
          {#each blogEntries as entry, i (entry.id)}
            {#if entry && entry?.__typename === "entryBlogSingle_Entry"}
              {#if entry?.title && entry?.url && entry?.postDate && entry.category[0]?.title}
                <!--TODO: fix typing-->
                <CardBlog
                  className="is-zoomInUp"
                  headline={entry.title}
                  url={entry?.url}
                  postDate={entry?.postDate}
                  categoryTitle={entry.category[0].title}
                  theme={["high", "middle", "low"][i] || "default"}
                  size="large"
                />
              {/if}
            {/if}
          {/each}
        </div>
      </div>
    {/if}

    {#if workEntries}
      <div class="fluid-grid">
        <div class={cc.bigTextWrapper}>
          <div class={cc.bigText} use:useFullWidthText><span>working</span></div>
        </div>
        <Headline className={cc.bigTextOverlay} text="work." />
        <GridBentoWork className={"span-content -mt-6 mb-24 z-10"} entries={workEntries} limit={4} random={true} />
      </div>
    {/if}

    {#if photoEntries}
      <div class="fluid-grid">
        <div class={cc.bigTextWrapper}>
          <div class={cc.bigText} use:useFullWidthText><span>shooting</span></div>
        </div>
        <Headline className={cc.bigTextOverlay} text="photos." />
        <div class={`${cc.cardGrid} ${cc.cardGridPhotos}`} use:useWaypoint data-waypoint>
          {#each photoEntries as entry (entry.id)}
            {#if entry && entry?.__typename === "entryPhotosSingle_Entry"}
              {#if entry?.title && entry?.url && entry?.image}
                <CardPhotos className="is-zoomInUp" headline={entry.title} url={entry?.url} image={entry?.image[0]} />
              {/if}
            {/if}
          {/each}
        </div>
        <!--        <div class="span-full px-8 -mt-24 -translate-y-2">-->
        <!--          <div-->
        <!--            class="w-full mx-auto h-4 bg-gradient-to-b from-neutral-800 to-neutral-800"-->
        <!--            style="clip-path: polygon(2% 0, 98% 0, 100% 100%, 0% 100%); translate: 0 -2spx;"></div>-->
        <!--          <div class="w-full mx-auto h-8 bg-neutral-700  shadow-2xl shadow-neutral-950"></div>-->
        <!--        </div>-->
      </div>
    {/if}
  </main>
{/if}

<style>
  @reference "../lib/styles/app.css";
  :global(body) {
    background-color: theme("colors.neutral.300");
    background-image: url($lib/images/bg-triangle-gray.avif);
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
