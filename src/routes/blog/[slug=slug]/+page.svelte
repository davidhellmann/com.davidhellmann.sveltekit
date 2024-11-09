<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import HeroBlog from "$components/hero/Blog.svelte";
  import ContentBuilder from "$components/builder/ContentBuilder.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const entry = getFirstEntry(data.entries);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryBlogSingle_Entry"}
  {#if entry?.title && entry?.category}
    <HeroBlog
      headline={entry?.customTitle ?? entry.title}
      backButton={{
        title: "Blog overview",
        url: "/blog"
      }}
    />
  {/if}

  {#if entry?.contentBuilder}
    <ContentBuilder
      blockTypes={entry?.contentBuilder}
    />
  {/if}
{/if}

