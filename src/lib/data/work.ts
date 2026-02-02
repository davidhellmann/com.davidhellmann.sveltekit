import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import type { Page_WorkSingleFragment } from "$graphql/graphql";

export const getWorkEntries = () => getEntriesCache<Page_WorkSingleFragment>("work");
export const getWorkEntry = (slug: string) => getEntry<Page_WorkSingleFragment>("work", slug);
export const getWorkArray = () => getEntriesArray<Page_WorkSingleFragment>("work");
export const getWorkCount = () => getEntriesCount("work");
