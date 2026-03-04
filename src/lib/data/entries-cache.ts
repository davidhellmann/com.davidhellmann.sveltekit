import { getGqlData } from "$graphql/graphql-client";
import type { RequestDocument } from "graphql-request";

type EntryWithSlug = { slug?: string | null; [key: string]: unknown };

const caches = new Map<string, Map<string, EntryWithSlug>>();
const fetchPromises = new Map<string, Promise<Map<string, EntryWithSlug>>>();

const BATCH_SIZE = Number(import.meta.env.VITE_BATCH_SIZE) || 100;

export async function getEntriesCache<T extends EntryWithSlug>(
	cacheKey: string,
	queryDocument: RequestDocument
): Promise<Map<string, T>> {
	if (caches.has(cacheKey)) return caches.get(cacheKey) as Map<string, T>;
	if (fetchPromises.has(cacheKey)) return fetchPromises.get(cacheKey) as Promise<Map<string, T>>;

	const promise = (async () => {
		const allEntries: T[] = [];
		let offset = 0;

		console.log(`[${cacheKey} Cache] Fetching in batches of ${BATCH_SIZE}...`);

		while (true) {
			const data = (await getGqlData(queryDocument, {
				limit: BATCH_SIZE,
				offset
			})) as { entries?: T[] };

			if (!data.entries?.length) break;
			allEntries.push(...data.entries);
			console.log(
				`[${cacheKey} Cache] Batch ${Math.floor(offset / BATCH_SIZE) + 1}: ${data.entries.length} (total: ${allEntries.length})`
			);
			if (data.entries.length < BATCH_SIZE) break;
			offset += BATCH_SIZE;
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

export async function getEntriesCount(
	cacheKey: string,
	queryDocument: RequestDocument
): Promise<number> {
	const cache = await getEntriesCache(cacheKey, queryDocument);
	return cache.size;
}
