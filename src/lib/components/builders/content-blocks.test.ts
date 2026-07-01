import { describe, expect, it } from "vitest";
import { getContentBlockKey, isContentBlock, isContentBlockType, type ContentBuilderBlock } from "./content-blocks";

describe("content block helpers", () => {
  const textBlock = {
    __typename: "block_text_Entry",
    id: "42",
    richText: "<p>Hello</p>"
  } as ContentBuilderBlock;

  it("recognizes generated content blocks", () => {
    expect(isContentBlock(textBlock)).toBe(true);
    expect(isContentBlock({})).toBe(false);
    expect(isContentBlock(null)).toBe(false);
    expect(isContentBlock(undefined)).toBe(false);
  });

  it("narrows content blocks by typename", () => {
    expect(isContentBlockType(textBlock, "block_text_Entry")).toBe(true);
    expect(isContentBlockType(textBlock, "block_image_Entry")).toBe(false);
  });

  it("uses stable keys for known and empty blocks", () => {
    expect(getContentBlockKey(textBlock, 0)).toBe("block_text_Entry-42");
    expect(getContentBlockKey({}, 3)).toBe("empty-3");
  });
});
