import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));
const photosComponentPath = resolve(currentDir, "Photos.svelte");

const readPhotosComponent = () => readFileSync(photosComponentPath, "utf8");

describe("Photos stack post date", () => {
  it("renders entry.postDate with the shared Time component", () => {
    const source = readPhotosComponent();

    expect(source).toContain('import Time from "$components/text/Time.svelte";');
    expect(source).toContain("{#if entry?.postDate}");
    expect(source).toContain("<Time");
    expect(source).toContain("timestamp={entry?.postDate}");
  });
});
