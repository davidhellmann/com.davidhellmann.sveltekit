import { describe, expect, it } from "vitest";
import { getEntriesArray, getEntriesCache, getEntriesCount, getEntry } from "./entries-cache";

type TestEntry = {
  slug?: string | null;
  title: string;
};

const entry = (index: number): TestEntry => ({
  slug: `entry-${index}`,
  title: `Entry ${index}`
});

describe("entries cache", () => {
  it("fetches batches until a short batch and preserves order", async () => {
    const entries = Array.from({ length: 55 }, (_, index) => entry(index));
    const fetchPage = async ({ limit, offset }: { limit: number; offset: number }) => ({
      entries: entries.slice(offset, offset + limit)
    });

    const result = await getEntriesArray<TestEntry>({
      cacheKey: "test-batches",
      fetchPage
    });

    expect(result).toHaveLength(55);
    expect(result.at(0)?.slug).toBe("entry-0");
    expect(result.at(-1)?.slug).toBe("entry-54");
  });

  it("coalesces concurrent fetches for the same collection", async () => {
    const entries = [entry(1), entry(2)];
    const offsets: number[] = [];
    const fetchPage = async ({ offset }: { limit: number; offset: number }) => {
      offsets.push(offset);
      return { entries: offset === 0 ? entries : [] };
    };

    const collection = {
      cacheKey: "test-concurrent",
      fetchPage
    };

    const [first, second] = await Promise.all([
      getEntriesCache<TestEntry>(collection),
      getEntriesCache<TestEntry>(collection)
    ]);

    expect(first).toBe(second);
    expect(offsets.length).toBeGreaterThan(0);
    expect(offsets.length).toBe(new Set(offsets).size);
  });

  it("skips entries without slugs deliberately", async () => {
    const collection = {
      cacheKey: "test-missing-slugs",
      fetchPage: async ({ offset }: { limit: number; offset: number }) => ({
        entries:
          offset === 0
            ? [{ slug: "has-slug", title: "Has slug" }, { slug: null, title: "Null slug" }, { title: "Missing slug" }]
            : []
      })
    };

    await expect(getEntriesCount(collection)).resolves.toBe(1);
    await expect(getEntry(collection, "has-slug")).resolves.toEqual({
      slug: "has-slug",
      title: "Has slug"
    });
  });
});
