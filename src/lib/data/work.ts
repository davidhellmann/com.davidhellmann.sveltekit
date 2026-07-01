import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { getWorkEntriesData } from "$graphql/cms-content";
import type { Page_WorkSingleFragment } from "$graphql/graphql";

const workCollection = {
  cacheKey: "work",
  fetchPage: getWorkEntriesData
};

export const getWorkEntries = () => getEntriesCache<Page_WorkSingleFragment>(workCollection);
export const getWorkEntry = (slug: string) => getEntry<Page_WorkSingleFragment>(workCollection, slug);
export const getWorkArray = () => getEntriesArray<Page_WorkSingleFragment>(workCollection);
export const getWorkCount = () => getEntriesCount(workCollection);
