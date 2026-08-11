import type { ContentBlock } from "$lib/types/content";

export type ContentBuilderBlock = ContentBlock | Record<PropertyKey, never> | null | undefined;

export const isContentBlock = (block: ContentBuilderBlock): block is ContentBlock =>
  Boolean(block && "__typename" in block);

export function isContentBlockType<TType extends ContentBlock["__typename"]>(
  block: ContentBuilderBlock,
  type: TType
): block is Extract<ContentBlock, { __typename: TType }> {
  return isContentBlock(block) && block.__typename === type;
}

export const getContentBlockKey = (block: ContentBuilderBlock, index: number): string => {
  if (isContentBlock(block)) {
    return `${block.__typename}-${block.id}`;
  }

  return `empty-${index}`;
};
