<script lang="ts">
  import type { PageProps } from "./$types";
  import Seo from "$components/seo/Seo.svelte";
  import Headline from "$components/text/Headline.svelte";

  let { data }: PageProps = $props();
  let entry = $derived(data.entry);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry.title}
  About
  <Headline text={entry.title} />
{/if}
