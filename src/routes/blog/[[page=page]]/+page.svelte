<script lang="ts">
  import type { PageProps } from "./$types";
  import StackBlog from "$components/stacks/Blog.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/seo/Seo.svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";
  import { afterNavigate } from "$app/navigation";
  import { replaceState } from "$app/navigation";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useJumpingLetters } from "$lib/actions/action.jumpingLetters";

  import { type EntryType_BlogSingleFragment, type EntryType_BlogListFragment } from "$graphql/graphql";

  let { data }: PageProps = $props();
  const entryCount = data.entryCount ?? 1;
  const totalPages = data.totalPages ?? 1;
  let blogEntry = getFirstEntry(data.blogEntry) as EntryType_BlogListFragment;
  let entries = $derived(data.entries as EntryType_BlogSingleFragment[]);
  let page = $derived(data.page);

  afterNavigate(() => {
    if (page === 1) {
      replaceState("/blog", {});
    }
  });

  const cc = {
    heading: "span-content text-neon-pink is-zoomInDown text-7xl font-decorative font-extrabold flex flex-wrap",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&_*_strong]:decoration-wavy [&_*_strong]:underline [&_*_strong]:decoration-4 [&_*_strong]:decoration-accent-purple-400",
    list: "span-popout z-10 @container"
  };

  let letters = $derived(splitTextIntoDivs(blogEntry?.customTitle, "is-blurInLeftDown", "$"));

  console.log(blogEntry);
</script>

{#if blogEntry?.seomatic}
  <Seo seo={blogEntry.seomatic} />
{/if}

{#if page === 1}
  {#if blogEntry?.customTitle}
    <div class={cc.heading} use:useWaypoint data-waypoint use:useJumpingLetters>
      <!-- eslint-disable-next-line -->
      {@html letters}
    </div>
  {/if}
  {#if blogEntry.description}
    <RichText className={cc.text} html={blogEntry.description} data-waypoint-target />
  {/if}
{:else}
  <div class="span-content text-neon-pink flex font-decorative text-7xl font-extrabold" use:useWaypoint data-waypoint>
    <!-- eslint-disable-next-line -->
    {@html splitTextIntoDivs(`Page ${page.toString()}`, "is-blurInLeftDown")}
  </div>
{/if}
<StackBlog {entries} showPagination={true} totalItems={entryCount} {totalPages} {page} className={cc.list} />
