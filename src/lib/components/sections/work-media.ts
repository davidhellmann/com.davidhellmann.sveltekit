import type { WorkEntry } from "$lib/types/content";

type WorkEntryMedia = Pick<WorkEntry, "contentBuilderWork" | "images"> | undefined;
type WorkMediaSourceBlock = NonNullable<NonNullable<WorkEntryMedia>["contentBuilderWork"]>[number] | null | undefined;
type WorkImages = NonNullable<NonNullable<WorkEntryMedia>["images"]>;

export type WorkMediaGroup = {
  images: WorkImages;
  ratio?: string;
};

const isWorkImageBlock = (
  block: WorkMediaSourceBlock
): block is Extract<WorkMediaSourceBlock, { __typename: "block_image_Entry" }> =>
  Boolean(block && "__typename" in block && block.__typename === "block_image_Entry");

const isWorkImagesBlock = (
  block: WorkMediaSourceBlock
): block is Extract<WorkMediaSourceBlock, { __typename: "block_images_Entry" }> =>
  Boolean(block && "__typename" in block && block.__typename === "block_images_Entry");

export const resolveWorkMediaGroups = (entry: WorkEntryMedia): WorkMediaGroup[] => {
  if (!entry) return [];

  const builderGroups = (entry.contentBuilderWork ?? []).flatMap((block): WorkMediaGroup[] => {
    if (isWorkImageBlock(block) && block.image[0]) {
      return [
        {
          images: [block.image[0]],
          ratio: block.imageRatio
        }
      ];
    }

    if (isWorkImagesBlock(block) && block.images.length > 0) {
      return [
        {
          images: block.images,
          ratio: block.imageRatio
        }
      ];
    }

    return [];
  });

  if (builderGroups.length > 0) {
    return builderGroups;
  }

  if (entry.images?.length) {
    return [
      {
        images: entry.images
      }
    ];
  }

  return [];
};
