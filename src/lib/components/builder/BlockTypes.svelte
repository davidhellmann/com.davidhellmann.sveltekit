<script lang="ts">
  import RichText from "$components/builder/_blocks/RichText.svelte";
  import Code from "$components/builder/_blocks/Code.svelte";
  import Quote from "$components/builder/_blocks/Quote.svelte";
  import Image from "$components/builder/_blocks/Image.svelte";
  import Cta from "$components/builder/_blocks/Cta.svelte";
  import type {Matrix_ContentBuilderFragment, EntryType_DataFragment} from "$lib/graphql/graphql";

  type BlockTypes = {
    blockTypes: Array<Matrix_ContentBuilderFragment & EntryType_DataFragment>;
    className?: string;
  };

  const {
    blockTypes,
    className
  }: BlockTypes = $props();
</script>

<div class={`fluid-grid ${className}`}>
  {#if blockTypes}
    {#each blockTypes as blockType (blockType)}
      {#if blockType.__typename === "blockText_Entry"}
        {#if blockType?.richText}
          <RichText html={blockType.richText}/>
        {/if}

      {:else if blockType.__typename === "blockCode_Entry"}
        {#if blockType?.codeSnippet?.value && blockType?.codeSnippet?.language}
          <Code code={blockType.codeSnippet.value} language={blockType.codeSnippet.language}/>
        {/if}

      {:else if blockType.__typename === "blockQuote_Entry"}
        {#if blockType?.quote}
          <Quote quote={blockType.quote}
                 source={blockType.source}
                 link={blockType.hyperLink[0]}
          />
        {/if}

      {:else if blockType.__typename === "blockImage_Entry"}
        {#if blockType?.image[0]}
          <Image
            image={blockType.image[0]}
            imageRatio={blockType.imageRatio}
            showCaption={blockType.showCaption}
          />
        {/if}

      {:else if blockType.__typename === "blockCta_Entry"}
        {#if blockType?.hyperLinks}
          <Cta
            title={blockType.title}
            description={blockType.description}
            links={blockType.hyperLinks}
          />
        {/if}
      {/if}
    {/each}
  {/if}
</div>
