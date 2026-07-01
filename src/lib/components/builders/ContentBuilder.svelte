<script lang="ts">
  import RichText from "$components/builders/_blocks/RichText.svelte";
  import Code from "$components/builders/_blocks/Code.svelte";
  import Quote from "$components/builders/_blocks/Quote.svelte";
  import Image from "$components/builders/_blocks/Image.svelte";
  import Images from "$components/builders/_blocks/Images.svelte";
  import Cta from "$components/builders/_blocks/Cta.svelte";
  import { getContentBlockKey, isContentBlockType, type ContentBuilderBlock } from "./content-blocks";
  import type { ComponentProps } from "svelte";
  import type { Matrix_ContentBuilderFragment } from "$graphql/graphql";

  type ContentBuilder = {
    compName?: string;
    blockTypes?: ContentBuilderBlock[];
    className?: string;
  };

  type ImageBlock = Extract<Matrix_ContentBuilderFragment, { __typename: "block_image_Entry" }>;
  type ImagesBlock = Extract<Matrix_ContentBuilderFragment, { __typename: "block_images_Entry" }>;

  const { compName = "ContentBuilder", blockTypes, className }: ContentBuilder = $props();

  const getImage = (blockType: ImageBlock): ComponentProps<typeof Image>["image"] =>
    blockType.image[0] as ComponentProps<typeof Image>["image"];

  const getImages = (blockType: ImagesBlock): ComponentProps<typeof Images>["images"] =>
    blockType.images as ComponentProps<typeof Images>["images"];
</script>

{#if blockTypes}
  <div class="span-full">
    <div class={`fluid-grid stack-12 ${className}`} data-comp={compName}>
      {#each blockTypes as blockType, index (getContentBlockKey(blockType, index))}
        {#if isContentBlockType(blockType, "block_text_Entry") && blockType?.richText}
          <RichText html={blockType.richText} />
        {:else if isContentBlockType(blockType, "block_code_Entry") && blockType?.codeSnippet?.value && blockType?.codeSnippet?.language}
          <Code
            code={blockType.codeSnippet.value}
            language={blockType.codeSnippet.language}
            name={blockType.codeSnippetName}
            html={blockType.codeSnippetDescription}
          />
        {:else if isContentBlockType(blockType, "block_quote_Entry") && blockType?.quote}
          <Quote quote={blockType.quote} source={blockType.source} link={blockType.hyperLink[0]} />
        {:else if isContentBlockType(blockType, "block_image_Entry") && blockType?.image[0]}
          <Image
            image={getImage(blockType)}
            width={blockType.imageWidth}
            showCaption={blockType.showCaption}
            className={blockType.imageRatio}
          />
        {:else if isContentBlockType(blockType, "block_images_Entry") && blockType?.images}
          <Images
            images={getImages(blockType)}
            ratio={blockType.imageRatio}
            showCaption={blockType.showCaption}
            imagesViewMode={blockType.imagesViewMode}
          />
        {:else if isContentBlockType(blockType, "block_cta_Entry") && blockType?.hyperLinks}
          <Cta headline={blockType.headline} description={blockType.description} links={blockType.hyperLinks} />
        {/if}
      {/each}
    </div>
  </div>
{/if}
