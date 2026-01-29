import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import type { EntryType_BlogSingleFragment } from "$graphql/graphql";

export const getBlogEntries = () => getEntriesCache<EntryType_BlogSingleFragment>("blog");
export const getBlogEntry = (slug: string) => getEntry<EntryType_BlogSingleFragment>("blog", slug);
export const getBlogArray = () => getEntriesArray<EntryType_BlogSingleFragment>("blog");
export const getBlogCount = () => getEntriesCount("blog");
