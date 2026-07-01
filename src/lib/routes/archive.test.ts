import { describe, expect, it } from "vitest";
import {
  getArchiveWindow,
  getCanonicalFirstPageRedirect,
  getOutOfRangeRedirect,
  getPagedArchiveRoutes,
  getTotalPages,
  parseArchivePage
} from "./archive";

describe("archive route helpers", () => {
  it("calculates total pages", () => {
    expect(getTotalPages(0, 24)).toBe(0);
    expect(getTotalPages(24, 24)).toBe(1);
    expect(getTotalPages(25, 24)).toBe(2);
  });

  it("parses invalid page params as the first page", () => {
    expect(parseArchivePage(undefined)).toBe(1);
    expect(parseArchivePage("1")).toBe(1);
    expect(parseArchivePage("4")).toBe(4);
    expect(parseArchivePage("nope")).toBe(1);
    expect(parseArchivePage("-1")).toBe(1);
  });

  it("generates first-page canonical and duplicate routes", () => {
    expect(getPagedArchiveRoutes(3)).toEqual([{ page: undefined }, { page: "1" }, { page: "2" }, { page: "3" }]);
  });

  it("generates slugged taxonomy archive routes", () => {
    expect(getPagedArchiveRoutes(2, { slug: "design" })).toEqual([
      { slug: "design", page: undefined },
      { slug: "design", page: "1" },
      { slug: "design", page: "2" }
    ]);
  });

  it("returns the entries for the requested page", () => {
    const window = getArchiveWindow(["a", "b", "c", "d", "e"], 2, 2);

    expect(window).toEqual({
      entries: ["c", "d"],
      entryCount: 5,
      offset: 2,
      page: 2,
      totalPages: 3
    });
  });

  it("decides canonical first-page redirects", () => {
    expect(getCanonicalFirstPageRedirect(1, "1", "/blog")).toBe("/blog");
    expect(getCanonicalFirstPageRedirect(1, undefined, "/blog")).toBeUndefined();
    expect(getCanonicalFirstPageRedirect(2, "2", "/blog")).toBeUndefined();
  });

  it("decides out-of-range redirects", () => {
    expect(getOutOfRangeRedirect(4, 3, "/blog")).toBe("/blog/3");
    expect(getOutOfRangeRedirect(1, 0, "/blog")).toBeUndefined();
    expect(getOutOfRangeRedirect(2, 3, "/blog")).toBeUndefined();
  });
});
