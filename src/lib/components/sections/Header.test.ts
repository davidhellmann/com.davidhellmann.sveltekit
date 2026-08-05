import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const headerSource = () => readFileSync(resolve(currentDir, "Header.svelte"), "utf8");

describe("Header accessibility", () => {
  it("gives the logo home link a discernible name", () => {
    const homeLink = headerSource().match(/<a\b[^>]*href=\{resolve\("\/"\)\}[^>]*>/s)?.[0];

    expect(homeLink).toBeDefined();
    expect(homeLink).toContain('aria-label="Home"');
  });
});
