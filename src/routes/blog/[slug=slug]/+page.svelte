<script lang="ts">
  import type { PageProps } from "./$types";
  import Seo from "#lib/components/seo/Seo.svelte";
  import HeroBlog from "#lib/components/heros/Blog.svelte";
  import ContentBuilder from "#lib/components/builders/ContentBuilder.svelte";
  import PrevNext from "#lib/components/navigation/PrevNext.svelte";

  let { data }: PageProps = $props();

  const entry = $derived(data.entry);
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
