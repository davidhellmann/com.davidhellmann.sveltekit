import { getGqlData } from "$graphql/graphql-client";
import { GetEntriesDocument, type GetEntriesQueryVariables } from "$graphql/graphql";

type EntryWithSlug = { slug?: string | null; [key: string]: unknown };

const caches = new Map<string, Map<string, EntryWithSlug>>();
const fetchPromises = new Map<string, Promise<Map<string, EntryWithSlug>>>();

const BATCH_SIZE = Number(import.meta.env.VITE_BATCH_SIZE) || 100;

export async function getEntriesCache<T extends EntryWithSlug>(section: string): Promise<Map<string, T>> {
  if (caches.has(section)) return caches.get(section) as Map<string, T>;
  if (fetchPromises.has(section)) return fetchPromises.get(section) as Promise<Map<string, T>>;

  const promise = (async () => {
    const allEntries: T[] = [];
    let offset = 0;

    console.log(`[${section} Cache] Fetching in batches of ${BATCH_SIZE}...`);

    while (true) {
      const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
        section: [section],
        limit: BATCH_SIZE,
        offset
      })) as { entries?: T[] };

      if (!entries?.length) break;
      allEntries.push(...entries);
      console.log(`[${section} Cache] Batch ${Math.floor(offset / BATCH_SIZE) + 1}: ${entries.length} (total: ${allEntries.length})`);
      if (entries.length < BATCH_SIZE) break;
      offset += BATCH_SIZE;
    }

    const cache = new Map(allEntries.map((e) => [e.slug!, e]));
    caches.set(section, cache);
    console.log(`[${section} Cache] Loaded ${cache.size} entries`);
    return cache;
  })();

  fetchPromises.set(section, promise);
  return promise as Promise<Map<string, T>>;
}

export async function getEntry<T extends EntryWithSlug>(section: string, slug: string): Promise<T | undefined> {
  const cache = await getEntriesCache<T>(section);
  return cache.get(slug);
}

export async function getEntriesArray<T extends EntryWithSlug>(section: string): Promise<T[]> {
  const cache = await getEntriesCache<T>(section);
  return [...cache.values()];
}

export async function getEntriesCount(section: string): Promise<number> {
  const cache = await getEntriesCache(section);
  return cache.size;
}
