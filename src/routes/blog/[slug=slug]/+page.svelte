<script lang="ts">
  import type { PageProps } from "./$types";
  import type { EntryType_BlogSingleFragment } from "$graphql/graphql";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import HeroBlog from "$components/heros/Blog.svelte";
  import ContentBuilder from "$components/builders/ContentBuilder.svelte";

  let { data }: PageProps = $props();

  const entry = getFirstEntry(data.entries) as EntryType_BlogSingleFragment;
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

<HeroBlog
  headline={entry?.customTitle ?? entry?.title}
  backButton={{
    title: "Blog overview",
    url: "/blog"
  }}
/>

<ContentBuilder blockTypes={entry?.contentBuilder} />
