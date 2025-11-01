<script lang="ts">
  import BlockTypes from "$components/builders/BlockTypes.svelte";
  import type { Matrix_ContentBuilderFragment } from "$graphql/graphql";

  type ContentBuilder = {
    blockTypes?: Matrix_ContentBuilderFragment[];
  };

  const { blockTypes }: ContentBuilder = $props();
</script>

{#if blockTypes}
  <div class="span-full">
    <BlockTypes {blockTypes} />
  </div>
{/if}
