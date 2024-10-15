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
  <BlockTypes {blockTypes} className="stack-12"/>
{/if}
