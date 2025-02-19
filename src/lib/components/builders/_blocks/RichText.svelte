<script lang="ts">
  import RichText from "$components/text/RichText.svelte";

  type BlockRichText = {
      compName?: string;
    html: string;
  }

  const {
    compName = "BlockRichText",
    html,
  }: BlockRichText = $props();
</script>

{#if html}
  <div class="span-xl" data-comp={compName}>
    <RichText html={html} className="max-w-prose"/>
  </div>
{/if}
