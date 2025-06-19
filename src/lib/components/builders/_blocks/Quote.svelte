<script lang="ts">
  import type { Hyper_DataFragment } from "$lib/graphql/graphql";
  import Quote from "$components/text/Quote.svelte";

  type BlockQuote = {
    compName?: string;
    quote: string;
    source?: string;
    link?: Hyper_DataFragment | undefined;
  };

  const { compName = "BlockQuote", quote, source, link }: BlockQuote = $props();
</script>

{#if quote}
  <div class="span-content" data-comp={compName}>
    <Quote {quote} {source} {link} />
  </div>
{/if}
