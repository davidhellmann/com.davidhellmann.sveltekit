import type { Page_WorkSingleFragment } from "$graphql/graphql";

type WorkEntryMedia = Pick<Page_WorkSingleFragment, "contentBuilderWork" | "images"> | undefined;
type WorkMediaSourceBlock = NonNullable<WorkEntryMedia>["contentBuilderWork"][number] | null | undefined;

export type WorkMediaGroup = {
  images: NonNullable<WorkEntryMedia>["images"];
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

  const builderGroups = entry.contentBuilderWork.flatMap((block): WorkMediaGroup[] => {
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

  if (entry.images.length > 0) {
    return [
      {
        images: entry.images
      }
    ];
  }

  return [];
};
