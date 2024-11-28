<script lang="ts">
  import BlockTypes from "$components/builder/BlockTypes.svelte";

  type ContentBuilder = {
    blockTypes: {
      __typename: string;
      [key: string]: unknown
    }[];
    context?: "default" | "work";
  };

  const {
    blockTypes,
    context = "default"
  }: ContentBuilder = $props();
</script>

{#if blockTypes}
  <div class="span-full">
    <BlockTypes context={context} blockTypes={blockTypes} />
  </div>
{/if}
