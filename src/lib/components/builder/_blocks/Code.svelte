<script lang="ts">
  import Code from "$lib/components/text/Code.svelte";

  type BlockCode = {
    code: string;
    language: string;
  }

  const {
    code,
    language
  }: BlockCode = $props();
</script>

{#if code}
  <div class="col-start-[popout] col-end-[full]">
    <Code code={code} language={language}/>
  </div>
{/if}
