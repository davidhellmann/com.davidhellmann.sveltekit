import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import type { Page_PhotosSingleFragment } from "$graphql/graphql";

export const getPhotosEntries = () => getEntriesCache<Page_PhotosSingleFragment>("photos");
export const getPhotosEntry = (slug: string) => getEntry<Page_PhotosSingleFragment>("photos", slug);
export const getPhotosArray = () => getEntriesArray<Page_PhotosSingleFragment>("photos");
export const getPhotosCount = () => getEntriesCount("photos");
