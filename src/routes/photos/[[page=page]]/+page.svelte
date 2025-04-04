<script lang="ts">
  import type { PageData } from "./$types";
  import StackPhotos from "$components/stacks/Photos.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/seo/Seo.svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { afterNavigate } from "$app/navigation";
  import { replaceState } from "$app/navigation";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useJumpingLetters } from "$lib/actions/action.jumpingLetters";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const entryCount = data.entryCount ?? 1;
  const totalPages = data.totalPages ?? 1;
  let photosEntry = getFirstEntry(data.photosEntry);
  let entries = $derived(data.entries);
  let page = $derived(data.page);

  console.log("YAY", photosEntry);

  afterNavigate(() => {
    if (page === 1) {
      replaceState("/photos", {});
    }
  });

  const cc = {
    heading: "span-content text-neon-pink is-zoomInDown text-7xl font-decorative font-extrabold flex flex-wrap",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&_*_strong]:decoration-wavy [&_*_strong]:underline [&_*_strong]:decoration-4 [&_*_strong]:decoration-accent-purple-400",
    list: "span-popout z-10 @container"
  };

  // split string and map each letter into a div
  let letters = $derived(splitTextIntoDivs(photosEntry?.customTitle, "is-blurInLeftDown", "$"));
</script>

{#if photosEntry?.seomatic}
  <Seo seo={photosEntry.seomatic} />
{/if}

{#if photosEntry && photosEntry?.__typename === "entryPhotosList_Entry"}
  {#if page === 1}
    {#if photosEntry?.customTitle}
      <div class={cc.heading} use:useWaypoint data-waypoint use:useJumpingLetters>
        <!-- eslint-disable-next-line -->
        {@html letters}
      </div>
    {/if}
    {#if photosEntry.description}
      <RichText className={cc.text} html={photosEntry.description} data-waypoint-target />
    {/if}
  {:else}
    <div class="span-content text-neon-pink flex font-decorative text-7xl font-extrabold" use:useWaypoint data-waypoint>
      <!-- eslint-disable-next-line -->
      {@html splitTextIntoDivs(`Page ${page.toString()}`, "is-blurInLeftDown")}
    </div>
  {/if}
  <StackPhotos {entries} showPagination={true} totalItems={entryCount} {totalPages} {page} className={cc.list} />
{/if}
