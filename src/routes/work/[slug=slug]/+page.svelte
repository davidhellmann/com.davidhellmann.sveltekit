<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const entry = getFirstEntry(data.entries);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryWorkSingle_Entry"}
  {#if entry?.title}
    {entry?.title}
  {/if}
{/if}

