type EntryWithSlug = { slug?: string | null; [key: string]: unknown };
type FetchEntriesPage<T extends EntryWithSlug> = (variables: {
  limit: number;
  offset: number;
}) => Promise<{ entries?: T[] }>;
type EntriesCollection<T extends EntryWithSlug> = {
  cacheKey: string;
  fetchPage: FetchEntriesPage<T>;
};

const caches = new Map<string, Map<string, EntryWithSlug>>();
const fetchPromises = new Map<string, Promise<Map<string, EntryWithSlug>>>();

const BATCH_SIZE = Number(import.meta.env.VITE_BATCH_SIZE) || 50;
const CONCURRENCY = Number(import.meta.env.VITE_CONCURRENCY) || 10;

export async function getEntriesCache<T extends EntryWithSlug>(
  collection: EntriesCollection<T>
): Promise<Map<string, T>> {
  const { cacheKey, fetchPage } = collection;

  if (caches.has(cacheKey)) return caches.get(cacheKey) as Map<string, T>;
  if (fetchPromises.has(cacheKey)) return fetchPromises.get(cacheKey) as Promise<Map<string, T>>;

  const promise = (async () => {
    const allEntries: T[] = [];
    let offset = 0;
    const totalStart = performance.now();

    console.log(`[${cacheKey} Cache] Fetching in batches of ${BATCH_SIZE} with concurrency ${CONCURRENCY}...`);

    while (true) {
      const batchOffsets = Array.from({ length: CONCURRENCY }, (_, i) => offset + i * BATCH_SIZE);

      const results = await Promise.all(
        batchOffsets.map(async (batchOffset) => {
          const start = performance.now();
          const data = await fetchPage({
            limit: BATCH_SIZE,
            offset: batchOffset
          });
          const duration = performance.now() - start;
          return { entries: data.entries ?? [], duration };
        })
      );

      let done = false;
      for (let i = 0; i < results.length; i++) {
        const { entries, duration } = results[i];
        if (!entries.length) {
          done = true;
          break;
        }
        allEntries.push(...entries);
        const batchNum = Math.floor(batchOffsets[i] / BATCH_SIZE) + 1;
        const ms = Math.round(duration);
        const time = ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;
        console.log(`[${cacheKey} Cache] Batch ${batchNum}: ${entries.length} (total: ${allEntries.length}) [${time}]`);
        if (entries.length < BATCH_SIZE) {
          done = true;
          break;
        }
      }

      if (done) break;
      offset += CONCURRENCY * BATCH_SIZE;
    }

    const cache = new Map(
      allEntries
        .filter((entry): entry is T & { slug: string } => Boolean(entry.slug))
        .map((entry) => [entry.slug, entry])
    );
    caches.set(cacheKey, cache);
    const totalMs = Math.round(performance.now() - totalStart);
    const totalTime = totalMs >= 1000 ? `${(totalMs / 1000).toFixed(2)}s` : `${totalMs}ms`;
    console.log(`[${cacheKey} Cache] Loaded ${cache.size} entries [${totalTime}]`);
    return cache;
  })();

  fetchPromises.set(cacheKey, promise);
  return promise as Promise<Map<string, T>>;
}

export async function getEntry<T extends EntryWithSlug>(
  collection: EntriesCollection<T>,
  slug: string
): Promise<T | undefined> {
  const cache = await getEntriesCache<T>(collection);
  return cache.get(slug);
}

export async function getEntriesArray<T extends EntryWithSlug>(collection: EntriesCollection<T>): Promise<T[]> {
  const cache = await getEntriesCache<T>(collection);
  return [...cache.values()];
}

export async function getEntriesCount(collection: EntriesCollection<EntryWithSlug>): Promise<number> {
  const cache = await getEntriesCache(collection);
  return cache.size;
}
