import type { Matrix_ContentBuilderFragment } from "$graphql/graphql";

export type ContentBuilderBlock = Matrix_ContentBuilderFragment | Record<PropertyKey, never> | null | undefined;

export const isContentBlock = (block: ContentBuilderBlock): block is Matrix_ContentBuilderFragment =>
  Boolean(block && "__typename" in block);

export function isContentBlockType<TType extends Matrix_ContentBuilderFragment["__typename"]>(
  block: ContentBuilderBlock,
  type: TType
): block is Extract<Matrix_ContentBuilderFragment, { __typename: TType }> {
  return isContentBlock(block) && block.__typename === type;
}

export const getContentBlockKey = (block: ContentBuilderBlock, index: number): string => {
  if (isContentBlock(block)) {
    return `${block.__typename}-${block.id}`;
  }

  return `empty-${index}`;
};
