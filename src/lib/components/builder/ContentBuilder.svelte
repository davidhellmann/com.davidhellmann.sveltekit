<script lang="ts">
  import BlockTypes from "$components/builder/BlockTypes.svelte";

  type ContentBuilder = {
    blockTypes: {
      __typename: string;
      [key: string]: unknown
    }[];
  };

  const {
    blockTypes
  }: ContentBuilder = $props();
</script>

{#if blockTypes}
  <div class="span-full">
    <BlockTypes blockTypes={blockTypes} />
  </div>
{/if}
