<script lang="ts">
  import type { PageProps } from "./$types";
  import StackBlog from "$components/stacks/Blog.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/seo/Seo.svelte";
  import { useSplitText } from "$lib/actions/action.splitText";

  let { data }: PageProps = $props();
  const entryCount = data.entryCount ?? 1;
  const totalPages = data.totalPages ?? 1;
  let blogEntry = $derived(data.blogEntry);
  let entries = $derived(data.entries);
  let page = $derived(data.page);

  const cc = {
    heading: "span-content text-neon-pink text-7xl font-decorative font-extrabold",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&_*_strong]:decoration-wavy [&_*_strong]:underline [&_*_strong]:decoration-4 [&_*_strong]:decoration-accent-purple-400",
    list: "span-popout z-10 @container"
  };
</script>

{#if blogEntry?.seomatic}
  <Seo seo={blogEntry.seomatic} />
{/if}

{#key page}
  {#if page === 1}
    {#if blogEntry?.customTitle}
      <h1 data-split-text hidden class={cc.heading} use:useSplitText={{ direction: "fromTop" }}>
        {#each blogEntry.customTitle.split("$") as line, index (`${line}-${index}`)}
          {#if index > 0}<br />{/if}
          {line}
        {/each}
      </h1>
    {/if}
    {#if blogEntry?.description}
      <RichText className={cc.text} html={blogEntry.description} data-waypoint-target />
    {/if}
  {:else}
    <h1
      data-split-text
      hidden
      class="span-content text-neon-pink font-decorative text-7xl font-extrabold"
      use:useSplitText={{ direction: "fromTop" }}
    >
      Page {page.toString()}
    </h1>
  {/if}
{/key}
<StackBlog {entries} showPagination={true} totalItems={entryCount} {totalPages} {page} className={cc.list} />
