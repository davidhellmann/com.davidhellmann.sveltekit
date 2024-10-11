<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import HeroBlog from "$components/hero/Blog.svelte";

  export let data: PageData;
  const entry = getFirstEntry(data.entries);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

<div class="bg-foo">
  {#if entry && entry?.__typename === "entryBlogDetail_Entry"}
    {#if entry?.title && entry?.category}
      <HeroBlog
        headline={entry.title}
        category={{
          title: entry.category[0]?.title,
          url: entry.category[0]?.url
        }}
      />
    {/if}
  {/if}
</div>
