<script lang="ts">
  import type { Hyperlink } from "#lib/types/content.js";
  import Quote from "#lib/components/text/Quote.svelte";

  type BlockQuote = {
    compName?: string;
    quote: string;
    source?: string;
    link?: Hyperlink | undefined;
  };

  const { compName = "BlockQuote", quote, source, link }: BlockQuote = $props();
</script>

{#if quote}
  <div class="span-content" data-comp={compName}>
    <Quote {quote} {source} {link} />
  </div>
{/if}
