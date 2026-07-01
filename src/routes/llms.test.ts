import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const llmsRoutePath = resolve(currentDir, "llms.txt/+server.ts");
const llmsFullRoutePath = resolve(currentDir, "llms-full.txt/+server.ts");

const readLlmsRoute = () => readFileSync(llmsRoutePath, "utf8");

describe("LLM discovery routes", () => {
  it("links from the curated llms.txt index to the full index", () => {
    expect(readLlmsRoute()).toContain("/llms-full.txt");
  });

  it("provides a full llms index route", () => {
    expect(existsSync(llmsFullRoutePath)).toBe(true);
  });
});
