<script lang="ts">
  import type { PageProps } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import type { Page_BlogSingleFragment } from "$graphql/graphql";
  import Seo from "$components/seo/Seo.svelte";
  import HeroBlog from "$components/heros/Blog.svelte";
  import ContentBuilder from "$components/builders/ContentBuilder.svelte";
  import PrevNext from "$components/navigation/PrevNext.svelte";

  let { data }: PageProps = $props();

  const entry = $derived(getFirstEntry(data.entries) as Page_BlogSingleFragment);
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
  category={entry?.category}
  topics={entry?.topics}
/>

<ContentBuilder blockTypes={entry?.contentBuilder} />
<PrevNext prev={entry?.prev} next={entry?.next} className="span-content" />
