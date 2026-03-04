import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { GetBlogEntriesDocument, type Page_BlogSingleFragment } from "$graphql/graphql";

export const getBlogEntries = () =>
	getEntriesCache<Page_BlogSingleFragment>("blog", GetBlogEntriesDocument);
export const getBlogEntry = (slug: string) =>
	getEntry<Page_BlogSingleFragment>("blog", GetBlogEntriesDocument, slug);
export const getBlogArray = () =>
	getEntriesArray<Page_BlogSingleFragment>("blog", GetBlogEntriesDocument);
export const getBlogCount = () => getEntriesCount("blog", GetBlogEntriesDocument);
