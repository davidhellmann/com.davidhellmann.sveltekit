import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));
const photosComponentPath = resolve(currentDir, "Photos.svelte");
const doubleQuote = String.fromCharCode(34);

const readPhotosComponent = () => readFileSync(photosComponentPath, "utf8");

describe("Photos stack post date", () => {
  it("renders entry.postDate with the shared Time component", () => {
    const source = readPhotosComponent();

    expect(source).toContain(`import Time from ${doubleQuote}$components/text/Time.svelte${doubleQuote};`);
    expect(source).toContain("{#if entry?.postDate}");
    expect(source).toMatch(/<Time[\s\S]*timestamp=\{entry\?\.postDate\}[\s\S]*\/>/);
  });
});
