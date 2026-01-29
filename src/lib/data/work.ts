import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import type { EntryType_WorkSingleFragment } from "$graphql/graphql";

export const getWorkEntries = () => getEntriesCache<EntryType_WorkSingleFragment>("work");
export const getWorkEntry = (slug: string) => getEntry<EntryType_WorkSingleFragment>("work", slug);
export const getWorkArray = () => getEntriesArray<EntryType_WorkSingleFragment>("work");
export const getWorkCount = () => getEntriesCount("work");
