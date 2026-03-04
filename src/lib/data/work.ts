import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { GetWorkEntriesDocument, type Page_WorkSingleFragment } from "$graphql/graphql";

export const getWorkEntries = () =>
	getEntriesCache<Page_WorkSingleFragment>("work", GetWorkEntriesDocument);
export const getWorkEntry = (slug: string) =>
	getEntry<Page_WorkSingleFragment>("work", GetWorkEntriesDocument, slug);
export const getWorkArray = () =>
	getEntriesArray<Page_WorkSingleFragment>("work", GetWorkEntriesDocument);
export const getWorkCount = () => getEntriesCount("work", GetWorkEntriesDocument);
