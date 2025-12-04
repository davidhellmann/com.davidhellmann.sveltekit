<script lang="ts">
  import type { PageProps } from "./$types";
  import StackPhotos from "$components/stacks/Photos.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/seo/Seo.svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useJumpingLetters } from "$lib/actions/action.jumpingLetters";

  import { type EntryType_PhotosSingleFragment, type EntryType_PhotosListFragment } from "$graphql/graphql";

  let { data }: PageProps = $props();
  const entryCount = data.entryCount ?? 1;
  const totalPages = data.totalPages ?? 1;
  let photosEntry = $derived(getFirstEntry(data.photosEntry) as EntryType_PhotosListFragment);
  let entries = $derived(data.entries) as EntryType_PhotosSingleFragment[];
  let page = $derived(data.page);

  const cc = {
    heading: "span-content text-black is-zoomInDown text-7xl font-decorative font-extrabold flex flex-wrap",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&*strong]:decoration-wavy [&*strong]:underline [&*strong]:decoration-4 [&*strong]:decoration-accent-purple-400",
    list: "span-content z-10 @container"
  };

  // split string and map each letter into a div
  let letters = $derived(splitTextIntoDivs(photosEntry?.customTitle ?? "", "is-blurInLeftDown", "$"));
</script>

{#if photosEntry?.seomatic}
  <Seo seo={photosEntry.seomatic} />
{/if}

{#if photosEntry}
  {#key page}
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
      <div class="span-content text-black flex font-decorative text-7xl font-extrabold" use:useWaypoint data-waypoint>
        <!-- eslint-disable-next-line -->
        {@html splitTextIntoDivs(`Page ${page.toString()}`, "is-blurInLeftDown")}
      </div>
    {/if}
  {/key}
  <StackPhotos {entries} showPagination={true} totalItems={entryCount} {totalPages} {page} className={cc.list} />
{/if}
