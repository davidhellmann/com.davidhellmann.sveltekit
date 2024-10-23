<script lang="ts">
  import RichText from "$components/builder/_blocks/RichText.svelte";
  import Code from "$components/builder/_blocks/Code.svelte";
  import Quote from "$components/builder/_blocks/Quote.svelte";
  import Image from "$components/builder/_blocks/Image.svelte";
  import Images from "$components/builder/_blocks/Images.svelte";
  import Cta from "$components/builder/_blocks/Cta.svelte";
  import type { Matrix_ContentBuilderFragment, EntryType_DataFragment } from "$lib/graphql/graphql";

  type BlockTypes = {
    compName?: string;
    blockTypes: Array<Matrix_ContentBuilderFragment & EntryType_DataFragment>;
    className?: string;
  };

  const {
    compName = "BlockTypes",
    blockTypes,
    className
  }: BlockTypes = $props();
</script>

<div class={`fluid-grid stack-12 ${className}`} data-comp={compName}>
  {#if blockTypes}
    {#each blockTypes as blockType (blockType)}
      {#if blockType.__typename === "blockText_Entry" && blockType?.richText}
        <RichText html={blockType.richText} />

      {:else if blockType.__typename === "blockCode_Entry" && blockType?.codeSnippet?.value && blockType?.codeSnippet?.language}
        <Code
          code={blockType.codeSnippet.value}
          language={blockType.codeSnippet.language}
          name={blockType.codeSnippetName}
          html={blockType.codeSnippetDescription}
        />

      {:else if blockType.__typename === "blockQuote_Entry" && blockType?.quote}
        <Quote quote={blockType.quote}
               source={blockType.source}
               link={blockType.hyperLink[0]}
        />

      {:else if blockType.__typename === "blockImage_Entry" && blockType?.image[0]}
        <Image
          image={blockType.image[0]}
          ratio={blockType.imageRatio}
          width={blockType.imageWidth}
          showCaption={blockType.showCaption}
        />

      {:else if blockType.__typename === "blockImages_Entry" && blockType?.images}
        <Images
          images={blockType.images}
          ratio={blockType.imageRatio}
          showCaption={blockType.showCaption}
          imagesViewMode={blockType.imagesViewMode}
        />

      {:else if blockType.__typename === "blockCta_Entry" && blockType?.hyperLinks}
        <Cta
          title={blockType.title}
          description={blockType.description}
          links={blockType.hyperLinks}
        />
      {/if}
    {/each}
  {/if}
</div>
