import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { GetPhotosEntriesDocument, type Page_PhotosSingleFragment } from "$graphql/graphql";

export const getPhotosEntries = () =>
	getEntriesCache<Page_PhotosSingleFragment>("photos", GetPhotosEntriesDocument);
export const getPhotosEntry = (slug: string) =>
	getEntry<Page_PhotosSingleFragment>("photos", GetPhotosEntriesDocument, slug);
export const getPhotosArray = () =>
	getEntriesArray<Page_PhotosSingleFragment>("photos", GetPhotosEntriesDocument);
export const getPhotosCount = () => getEntriesCount("photos", GetPhotosEntriesDocument);
