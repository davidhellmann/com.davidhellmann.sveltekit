<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import Headline from "$components/text/Headline.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const entry = getFirstEntry(data.entries);
  const blogEntries = data?.blogEntries;
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

<div class="bg-foo">
  {#if entry}
    {#if entry?.title}
      <Headline text={entry.title} />
    {/if}

    {#if blogEntries}
      {#each blogEntries as blogEntry (blogEntry)}
        {#if blogEntry?.__typename === "entryBlogSingle_Entry"}
          {#if blogEntry?.title}
            <a href={blogEntry?.url}>
              <Headline text={blogEntry.title}/>
            </a>
          {/if}
        {/if}
      {/each}
    {/if}
  {/if}
</div>
