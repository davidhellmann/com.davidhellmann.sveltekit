<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import HeroBlog from "$components/hero/Blog.svelte";
  import AsideBlogDetail from "$components/aside/BlogDetail.svelte";
  import LayoutBlogDetail from "./_layoutBlogDetail.svelte";
  import ContentBuilder from "$components/builder/ContentBuilder.svelte";

  export let data: PageData;
  const entry = getFirstEntry(data.entries);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#snippet content()}
  {#if entry && entry?.__typename === "entryBlogDetail_Entry"}
    {#if entry?.title && entry?.category}
      <HeroBlog
        headline={entry.title}
        backButton={{
          title: "Blog overview",
          url: "/blog"
        }}
      />
    {/if}

    {#if entry?.contentBuilder}
      <ContentBuilder blockTypes={entry?.contentBuilder}/>
    {/if}
  {/if}
{/snippet}

{#snippet aside()}
  {#if entry && entry?.__typename === "entryBlogDetail_Entry"}
    {#if entry?.title && entry?.category}
      <AsideBlogDetail
        category={{
          title: entry.category[0]?.title,
          url: entry.category[0]?.url
        }}
      />
    {/if}
  {/if}
{/snippet}
<LayoutBlogDetail content={content} aside={aside} />

