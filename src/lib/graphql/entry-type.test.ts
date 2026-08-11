import { describe, expect, it } from "vitest";
import { getEntriesOfType, getEntryOfType } from "./entry-type";

type TestEntry =
  | Record<PropertyKey, never>
  | { __typename: "page_company_Entry"; id: string }
  | { __typename: "page_home_Entry"; id: string }
  | { __typename: "page_blogSingle_Entry"; id: string };

describe("getEntryOfType", () => {
  it("returns the first entry with the requested CMS type", () => {
    const entries: TestEntry[] = [
      {},
      { __typename: "page_company_Entry", id: "company" },
      { __typename: "page_home_Entry", id: "home" }
    ];

    expect(getEntryOfType(entries, "page_home_Entry")).toEqual({
      __typename: "page_home_Entry",
      id: "home"
    });
  });

  it("returns undefined when the requested CMS type is absent", () => {
    const entries: TestEntry[] = [{}];

    expect(getEntryOfType(entries, "page_home_Entry")).toBeUndefined();
  });
});

describe("getEntriesOfType", () => {
  it("returns only entries with the requested CMS type", () => {
    const entries: TestEntry[] = [
      {},
      { __typename: "page_blogSingle_Entry", id: "first" },
      { __typename: "page_company_Entry", id: "company" },
      { __typename: "page_blogSingle_Entry", id: "second" }
    ];

    expect(getEntriesOfType(entries, "page_blogSingle_Entry")).toEqual([
      { __typename: "page_blogSingle_Entry", id: "first" },
      { __typename: "page_blogSingle_Entry", id: "second" }
    ]);
  });
});
