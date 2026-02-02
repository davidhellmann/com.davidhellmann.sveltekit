import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import type { Page_BlogSingleFragment } from "$graphql/graphql";

export const getBlogEntries = () => getEntriesCache<Page_BlogSingleFragment>("blog");
export const getBlogEntry = (slug: string) => getEntry<Page_BlogSingleFragment>("blog", slug);
export const getBlogArray = () => getEntriesArray<Page_BlogSingleFragment>("blog");
export const getBlogCount = () => getEntriesCount("blog");
