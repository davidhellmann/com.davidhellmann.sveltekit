import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const llmsRoutePath = resolve(currentDir, "llms.txt/+server.ts");
const llmsFullRoutePath = resolve(currentDir, "llms-full.txt/+server.ts");
const aboutMarkdownRoutePath = resolve(currentDir, "about.md/+server.ts");
const blogMarkdownRoutePath = resolve(currentDir, "blog/[slug=slug].md/+server.ts");
const workMarkdownRoutePath = resolve(currentDir, "work/[slug=slug].md/+server.ts");
const seoComponentPath = resolve(currentDir, "../lib/components/seo/Seo.svelte");

const readLlmsRoute = () => readFileSync(llmsRoutePath, "utf8");
const readLlmsFullRoute = () => readFileSync(llmsFullRoutePath, "utf8");
const readSeoComponent = () => readFileSync(seoComponentPath, "utf8");

describe("LLM discovery routes", () => {
  it("links from the curated llms.txt index to the full index", () => {
    expect(readLlmsRoute()).toContain("/llms-full.txt");
  });

  it("provides a full llms index route", () => {
    expect(existsSync(llmsFullRoutePath)).toBe(true);
  });

  it("links to markdown resources next to their canonical routes", () => {
    expect(readLlmsRoute()).toContain("/about.md");
    expect(readLlmsRoute()).toContain("${section}/${e.slug}.md");
    expect(readLlmsRoute()).not.toContain("${SITE_URL}/ai/");
    expect(readLlmsRoute()).not.toContain("`/ai/");

    expect(readLlmsFullRoute()).toContain("/about.md");
    expect(readLlmsFullRoute()).toContain("${section}/${e.slug}.md");
    expect(readLlmsFullRoute()).not.toContain("${SITE_URL}/ai/");
    expect(readLlmsFullRoute()).not.toContain("`/ai/");
  });

  it("provides route-near markdown endpoints", () => {
    expect(existsSync(aboutMarkdownRoutePath)).toBe(true);
    expect(existsSync(blogMarkdownRoutePath)).toBe(true);
    expect(existsSync(workMarkdownRoutePath)).toBe(true);
  });

  it("advertises route-near markdown alternates in page metadata", () => {
    expect(readSeoComponent()).toContain("getMarkdownAlternate(page.url.pathname)");
    expect(readSeoComponent()).not.toContain("href=\"/ai/");
    expect(readSeoComponent()).not.toContain("return `/ai/");
  });
});
