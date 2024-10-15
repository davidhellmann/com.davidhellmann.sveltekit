<script lang="ts">
  import RichText from "$lib/components/text/RichText.svelte";

  type BlockRichText = {
    html: string;
  }

  const {
    html,
  }: BlockRichText = $props();
</script>

{#if html}
  <div class="span-content">
    <RichText html={html} className="max-w-prose"/>
  </div>
{/if}
