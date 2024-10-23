<script lang="ts">
  import Code from "$components/text/Code.svelte";

  type BlockCode = {
    compName?: string;
    code: string;
    language: string;
    name?: string;
    html?: string;
  }

  const {
    compName = "BlockCode",
    code,
    language,
    name,
    html
  }: BlockCode = $props();
</script>

{#if code}
  <div class="span-popout" data-comp={compName}>
    <Code {code} {language} {name} {html} />
  </div>
{/if}
