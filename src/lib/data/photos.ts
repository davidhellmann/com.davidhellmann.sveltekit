import { getGqlData } from "$graphql/graphql-client";
import {
  GetEntriesDocument,
  type GetEntriesQueryVariables,
  type EntryType_PhotosSingleFragment
} from "$graphql/graphql";

let photosCache: Map<string, EntryType_PhotosSingleFragment> | null = null;

const BATCH_SIZE = 100;

export async function getPhotosEntries(): Promise<Map<string, EntryType_PhotosSingleFragment>> {
  if (photosCache) return photosCache;

  const allEntries: EntryType_PhotosSingleFragment[] = [];
  let offset = 0;

  console.log(`[Photos Cache] Fetching entries in batches of ${BATCH_SIZE}...`);

  while (true) {
    const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
      section: ["photos"],
      limit: BATCH_SIZE,
      offset
    })) as { entries?: EntryType_PhotosSingleFragment[] };

    if (!entries?.length) break;

    allEntries.push(...entries);
    console.log(`[Photos Cache] Fetched batch ${Math.floor(offset / BATCH_SIZE) + 1}: ${entries.length} entries (total: ${allEntries.length})`);

    if (entries.length < BATCH_SIZE) break;
    offset += BATCH_SIZE;
  }

  photosCache = new Map(
    allEntries.map((e) => [e.slug!, e])
  );

  console.log(`[Photos Cache] Loaded ${photosCache.size} entries total`);
  return photosCache;
}

export async function getPhotosEntry(slug: string): Promise<EntryType_PhotosSingleFragment | undefined> {
  const cache = await getPhotosEntries();
  return cache.get(slug);
}

export async function getPhotosArray(): Promise<EntryType_PhotosSingleFragment[]> {
  const cache = await getPhotosEntries();
  return [...cache.values()];
}

export async function getPhotosCount(): Promise<number> {
  const cache = await getPhotosEntries();
  return cache.size;
}
