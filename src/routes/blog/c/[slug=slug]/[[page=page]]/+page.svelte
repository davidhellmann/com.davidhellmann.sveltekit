<script lang="ts">
  import type { PageProps } from "./$types";
  import StackBlog from "$components/stacks/Blog.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/seo/Seo.svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useJumpingLetters } from "$lib/actions/action.jumpingLetters";

  import { type EntryType_BlogSingleFragment, type EntryType_CategoryFragment } from "$graphql/graphql";

  let { data }: PageProps = $props();
  const entryCount = data.entryCount ?? 1;
  const totalPages = data.totalPages ?? 1;
  let categoryEntry = $derived(getFirstEntry(data.categoryEntry) as EntryType_CategoryFragment);
  let entries = $derived(data.entries as EntryType_BlogSingleFragment[]);
  let page = $derived(data.page);

  const cc = {
    heading: "span-content text-neon-pink is-zoomInDown text-6xl font-decorative font-extrabold flex flex-wrap",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&_*_strong]:decoration-wavy [&_*_strong]:underline [&_*_strong]:decoration-4 [&_*_strong]:decoration-accent-purple-400",
    list: "span-popout z-10 @container"
  };

  let letters = $derived(splitTextIntoDivs(categoryEntry?.title, "is-fadeIn lg:is-blurInLeftDown", "$"));
</script>

{#if categoryEntry?.seomatic}
  <Seo seo={categoryEntry.seomatic} />
{/if}

{#if page === 1}
  {#if categoryEntry?.title}
    <div class={cc.heading} use:useWaypoint data-waypoint use:useJumpingLetters>
      {@html letters}
    </div>
  {/if}
  {#if categoryEntry.description}
    <RichText className={cc.text} html={categoryEntry.description} data-waypoint-target />
  {/if}
{:else}
  <div class="span-content text-neon-pink flex font-decorative text-7xl font-extrabold" use:useWaypoint data-waypoint>
    {@html splitTextIntoDivs(`Page ${page.toString()}`, "is-fadeIn lg:is-blurInLeftDown")}
  </div>
{/if}
<StackBlog
  {entries}
  showPagination={true}
  paginationUri={`/${categoryEntry?.uri}`}
  totalItems={entryCount}
  {totalPages}
  {page}
  className={cc.list}
/>
