import { describe, expect, it } from "vitest";
import { shouldPreloadAsset } from "./hooks.server";

describe("server asset preloads", () => {
  it.each([
    "/_app/immutable/assets/hinted-Geomanist-Ultra.hash.woff2",
    "/_app/immutable/assets/poppins-latin-700-normal.hash.woff2",
    "/_app/immutable/assets/bitter-latin-wght-normal.hash.woff2"
  ])("preloads critical fonts: %s", (path) => {
    expect(shouldPreloadAsset("font", path)).toBe(true);
  });

  it.each([
    "/_app/immutable/assets/hinted-Geomanist-Medium.hash.woff2",
    "/_app/immutable/assets/poppins-latin-400-normal.hash.woff2",
    "/_app/immutable/assets/poppins-latin-500-normal.hash.woff2",
    "/_app/immutable/assets/jetbrains-mono-latin-wght-normal.hash.woff2",
    "/_app/immutable/assets/poppins-latin-700-normal.hash.woff"
  ])("does not preload non-critical or legacy fonts: %s", (path) => {
    expect(shouldPreloadAsset("font", path)).toBe(false);
  });

  it("keeps JavaScript and CSS preloading unchanged", () => {
    expect(shouldPreloadAsset("js", "/_app/app.js")).toBe(true);
    expect(shouldPreloadAsset("css", "/_app/app.css")).toBe(true);
  });
});
