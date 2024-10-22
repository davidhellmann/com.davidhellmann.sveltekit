<script lang="ts">
  import Code from "$lib/components/text/Code.svelte";

  type BlockCode = {
    compName?: string;
    code: string;
    language: string;
  }

  const {
    compName = "BlockCode",
    code,
    language
  }: BlockCode = $props();
</script>

{#if code}
  <div class="span-popout" data-comp={compName}>
    <Code code={code} language={language}/>
  </div>
{/if}
