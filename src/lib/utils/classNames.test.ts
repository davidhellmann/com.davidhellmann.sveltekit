import { describe, expect, it } from "vitest";

import { cn, tv } from "./classNames.js";

describe("classNames", () => {
  it("cn resolves custom class groups", () => {
    expect(cn("stack-2 span-md p-fluid", "stack-4 span-full p-4")).toBe("stack-4 span-full p-4");
  });

  it("tv uses the same custom merge config as cn", () => {
    const button = tv({
      base: "stack-2 span-md aspect-square",
      variants: {
        size: { lg: "stack-8 span-full aspect-landscape" }
      }
    });

    expect(button({ size: "lg" })).toBe("stack-8 span-full aspect-landscape");
    expect(button({ class: "stack-space-collapse stack-space-4" })).toBe("stack-2 span-md aspect-square stack-space-4");
  });

  it("tv returns joined classes when merging is disabled per call", () => {
    const box = tv({ base: "stack-2" }, { twMerge: false });

    expect(box({ class: "stack-4" })).toBe("stack-2 stack-4");
  });
});
