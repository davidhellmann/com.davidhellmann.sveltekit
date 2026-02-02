<script lang="ts">
  import type { PageProps } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import Headline from "$components/text/Headline.svelte";
  import { type Page_ContentBuilderFragment } from "$graphql/graphql";

  let { data }: PageProps = $props();
  let entry = getFirstEntry(data.entries) as Page_ContentBuilderFragment;
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry.title}
  About
  <Headline text={entry.title} />
{/if}
