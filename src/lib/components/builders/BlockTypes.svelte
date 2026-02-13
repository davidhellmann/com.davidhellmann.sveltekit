<script lang="ts">
  import RichText from "$components/builders/_blocks/RichText.svelte";
  import Code from "$components/builders/_blocks/Code.svelte";
  import Quote from "$components/builders/_blocks/Quote.svelte";
  import Image from "$components/builders/_blocks/Image.svelte";
  import Images from "$components/builders/_blocks/Images.svelte";
  import Cta from "$components/builders/_blocks/Cta.svelte";
  import type { Matrix_ContentBuilderFragment } from "$lib/graphql/graphql";
  import type { ComponentProps } from "svelte";

  type BlockTypes = {
    compName?: string;
    blockTypes?: Matrix_ContentBuilderFragment[];
    className?: string;
  };

  const { compName = "BlockTypes", blockTypes, className }: BlockTypes = $props();
</script>

<div class={`fluid-grid stack-12 ${className}`} data-comp={compName}>
  {#if blockTypes}
    {#each blockTypes as blockType (blockType)}
      {#if blockType.__typename === "block_text_Entry" && blockType?.richText}
        <RichText html={blockType.richText} />
      {:else if blockType.__typename === "block_code_Entry" && blockType?.codeSnippet?.value && blockType?.codeSnippet?.language}
        <Code
          code={blockType.codeSnippet.value}
          language={blockType.codeSnippet.language}
          name={blockType.codeSnippetName}
          html={blockType.codeSnippetDescription}
        />
      {:else if blockType.__typename === "block_quote_Entry" && blockType?.quote}
        <Quote quote={blockType.quote} source={blockType.source} link={blockType.hyperLink[0]} />
      {:else if blockType.__typename === "block_image_Entry" && blockType?.image[0]}
        <Image
          image={blockType.image[0]}
          width={blockType.imageWidth}
          showCaption={blockType.showCaption}
          className={blockType.imageRatio}
        />
      {:else if blockType.__typename === "block_images_Entry" && blockType?.images}
        <Images
          images={blockType.images}
          ratio={blockType.imageRatio}
          showCaption={blockType.showCaption}
          imagesViewMode={blockType.imagesViewMode}
        />
      {:else if blockType.__typename === "block_cta_Entry" && blockType?.hyperLinks}
        <Cta headline={blockType.headline} description={blockType.description} links={blockType.hyperLinks} />
      {/if}
    {/each}
  {/if}
</div>
