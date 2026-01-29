import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import type { EntryType_PhotosSingleFragment } from "$graphql/graphql";

export const getPhotosEntries = () => getEntriesCache<EntryType_PhotosSingleFragment>("photos");
export const getPhotosEntry = (slug: string) => getEntry<EntryType_PhotosSingleFragment>("photos", slug);
export const getPhotosArray = () => getEntriesArray<EntryType_PhotosSingleFragment>("photos");
export const getPhotosCount = () => getEntriesCount("photos");
