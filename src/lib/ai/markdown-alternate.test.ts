import { describe, expect, it } from "vitest";
import { getMarkdownAlternate } from "./markdown-alternate";

describe("getMarkdownAlternate", () => {
  it("returns route-near markdown URLs for pages with markdown variants", () => {
    expect(getMarkdownAlternate("/about")).toBe("/about.md");
    expect(getMarkdownAlternate("/blog/sample-post")).toBe("/blog/sample-post.md");
    expect(getMarkdownAlternate("/work/sample-work")).toBe("/work/sample-work.md");
  });

  it("does not return markdown URLs for archive pages", () => {
    expect(getMarkdownAlternate("/blog")).toBeNull();
    expect(getMarkdownAlternate("/blog/3")).toBeNull();
    expect(getMarkdownAlternate("/blog/c/design")).toBeNull();
  });
});
