<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import Headline from "$components/text/Headline.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let entry = $derived(getFirstEntry(data.entries));
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryAbout_Entry"}
    {#if entry.title}
      About
      <Headline text={entry.title} />
    {/if}
{/if}

{#if entry && entry?.__typename === "entryWorkList_Entry"}
    {#if entry.title}
      Work
      <Headline text={entry.title} />
    {/if}
{/if}
