<script lang="ts">
  import type { Hyper_DataFragment } from "$lib/graphql/graphql";

  type BlockQuote = {
    quote: string;
    source?: string;
    link?: Hyper_DataFragment | undefined;
  }

  const {
    quote,
    source,
    link
  }: BlockQuote = $props();
</script>

{#if quote}
  <div class="span-content">
    {quote}
    {#if source}{source}{/if}
    {#if link}{link}{/if}
  </div>
{/if}
