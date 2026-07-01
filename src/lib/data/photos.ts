import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { getPhotosEntriesData } from "$graphql/cms-content";
import type { Page_PhotosSingleFragment } from "$graphql/graphql";

const photosCollection = {
  cacheKey: "photos",
  fetchPage: getPhotosEntriesData
};

export const getPhotosEntries = () => getEntriesCache<Page_PhotosSingleFragment>(photosCollection);
export const getPhotosEntry = (slug: string) => getEntry<Page_PhotosSingleFragment>(photosCollection, slug);
export const getPhotosArray = () => getEntriesArray<Page_PhotosSingleFragment>(photosCollection);
export const getPhotosCount = () => getEntriesCount(photosCollection);
