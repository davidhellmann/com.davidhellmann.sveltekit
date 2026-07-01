import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { getBlogEntriesData } from "$graphql/cms-content";
import type { Page_BlogSingleFragment } from "$graphql/graphql";

const blogCollection = {
  cacheKey: "blog",
  fetchPage: getBlogEntriesData
};

export const getBlogEntries = () => getEntriesCache<Page_BlogSingleFragment>(blogCollection);
export const getBlogEntry = (slug: string) => getEntry<Page_BlogSingleFragment>(blogCollection, slug);
export const getBlogArray = () => getEntriesArray<Page_BlogSingleFragment>(blogCollection);
export const getBlogCount = () => getEntriesCount(blogCollection);
