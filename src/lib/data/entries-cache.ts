import { getGqlData } from "$graphql/graphql-client";
import type { RequestDocument } from "graphql-request";

type EntryWithSlug = { slug?: string | null; [key: string]: unknown };

const caches = new Map<string, Map<string, EntryWithSlug>>();
const fetchPromises = new Map<string, Promise<Map<string, EntryWithSlug>>>();

const BATCH_SIZE = Number(import.meta.env.VITE_BATCH_SIZE) || 50;
const CONCURRENCY = Number(import.meta.env.VITE_CONCURRENCY) || 10;

export async function getEntriesCache<T extends EntryWithSlug>(
  cacheKey: string,
  queryDocument: RequestDocument
): Promise<Map<string, T>> {
  if (caches.has(cacheKey)) return caches.get(cacheKey) as Map<string, T>;
  if (fetchPromises.has(cacheKey)) return fetchPromises.get(cacheKey) as Promise<Map<string, T>>;

  const promise = (async () => {
    const allEntries: T[] = [];
    let offset = 0;

    console.log(`[${cacheKey} Cache] Fetching in batches of ${BATCH_SIZE} with concurrency ${CONCURRENCY}...`);

    while (true) {
      const batchOffsets = Array.from({ length: CONCURRENCY }, (_, i) => offset + i * BATCH_SIZE);

      const results = await Promise.all(
        batchOffsets.map((batchOffset) =>
          getGqlData(queryDocument, {
            limit: BATCH_SIZE,
            offset: batchOffset
          }).then((data) => (data as { entries?: T[] }).entries ?? [])
        )
      );

      let done = false;
      for (let i = 0; i < results.length; i++) {
        const entries = results[i];
        if (!entries.length) {
          done = true;
          break;
        }
        allEntries.push(...entries);
        const batchNum = Math.floor(batchOffsets[i] / BATCH_SIZE) + 1;
        console.log(`[${cacheKey} Cache] Batch ${batchNum}: ${entries.length} (total: ${allEntries.length})`);
        if (entries.length < BATCH_SIZE) {
          done = true;
          break;
        }
      }

      if (done) break;
      offset += CONCURRENCY * BATCH_SIZE;
    }

    const cache = new Map(allEntries.map((e) => [e.slug!, e]));
    caches.set(cacheKey, cache);
    console.log(`[${cacheKey} Cache] Loaded ${cache.size} entries`);
    return cache;
  })();

  fetchPromises.set(cacheKey, promise);
  return promise as Promise<Map<string, T>>;
}

export async function getEntry<T extends EntryWithSlug>(
  cacheKey: string,
  queryDocument: RequestDocument,
  slug: string
): Promise<T | undefined> {
  const cache = await getEntriesCache<T>(cacheKey, queryDocument);
  return cache.get(slug);
}

export async function getEntriesArray<T extends EntryWithSlug>(
  cacheKey: string,
  queryDocument: RequestDocument
): Promise<T[]> {
  const cache = await getEntriesCache<T>(cacheKey, queryDocument);
  return [...cache.values()];
}

export async function getEntriesCount(cacheKey: string, queryDocument: RequestDocument): Promise<number> {
  const cache = await getEntriesCache(cacheKey, queryDocument);
  return cache.size;
}
