<script lang="ts">
  import type { Hyper_DataFragment } from "$lib/graphql/graphql";

  type BlockQuote = {
      compName?: string;
    quote: string;
    source?: string;
    link?: Hyper_DataFragment | undefined;
  }

  const {
    compName = "BlockQuote",
    quote,
    source,
    link
  }: BlockQuote = $props();
</script>

{#if quote}
  <div class="span-content" data-comp={compName}>
    {quote}
    {#if source}{source}{/if}
    {#if link}{link}{/if}
  </div>
{/if}
