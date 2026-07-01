import { describe, expect, it } from "vitest";
import { resolveWorkMediaGroups } from "./work-media";

const image = (id: string) => ({
  id,
  url: `/${id}.jpg`,
  width: 100,
  height: 100,
  title: id,
  alt: id,
  filename: `${id}.jpg`,
  focalPoint: [0.5, 0.5],
  svgCode: "",
  base64BlurHash: "",
  srcset: ""
});

describe("work media groups", () => {
  it("uses contentBuilderWork before top-level images", () => {
    const groups = resolveWorkMediaGroups({
      images: [image("fallback")],
      contentBuilderWork: [
        {
          __typename: "block_images_Entry",
          id: "block-1",
          imageRatio: "aspect-square",
          showCaption: false,
          imagesViewMode: "gallery",
          images: [image("builder")]
        }
      ]
    } as never);

    expect(groups).toEqual([
      {
        images: [image("builder")],
        ratio: "aspect-square"
      }
    ]);
  });

  it("falls back to top-level images", () => {
    const groups = resolveWorkMediaGroups({
      images: [image("fallback")],
      contentBuilderWork: []
    } as never);

    expect(groups).toEqual([
      {
        images: [image("fallback")],
        ratio: "aspect-auto"
      }
    ]);
  });

  it("ignores empty builder blocks", () => {
    const groups = resolveWorkMediaGroups({
      images: [],
      contentBuilderWork: [{}]
    } as never);

    expect(groups).toEqual([]);
  });
});
