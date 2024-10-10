<script lang="ts">
    import type { PageData } from "./$types";
    import { getFirstEntry } from "$lib/utils/getFirstEntry";
    import Headline from "$lib/components/text/Headline.svelte";

    export let data: PageData;
    const entry = getFirstEntry(data.entries);
</script>

<div>
  {#if entry && entry?.__typename === "entryBlogDetail_Entry"}
    {#if entry?.title}
      <Headline text={entry.title} tag="h1" preset="h1" />
    {/if}
  {/if}
</div>
