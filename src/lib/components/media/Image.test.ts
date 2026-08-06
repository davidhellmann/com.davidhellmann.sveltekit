import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const imageSource = () => readFileSync(resolve(currentDir, "Image.svelte"), "utf8");

describe("Image loading controls", () => {
  it("keeps loading, fetch priority, and preloading independent", () => {
    const source = imageSource();

    expect(source).toContain("lazy = true");
    expect(source).toContain('fetchPriority = "auto"');
    expect(source).toContain("preload = false");
    expect(source).toContain('loading={lazy ? "lazy" : "eager"}');
    expect(source).toContain("fetchpriority={fetchPriority}");
  });

  it("shares responsive sizing between the optional preload and image", () => {
    const source = imageSource();

    expect(source).toContain("{#if preload && src}");
    expect(source).toContain("imagesrcset={srcset}");
    expect(source).toContain("imagesizes={resolvedSizes}");
    expect(source).toContain("sizes={resolvedSizes}");
  });
});
