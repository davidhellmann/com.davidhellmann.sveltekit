export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  GetEntriesDocument,
  type GetEntriesQuery,
  type GetEntriesQueryVariables,
  GetPrerenderDataDocument,
  type GetPrerenderDataQueryVariables,
  type GetPrerenderDataQuery,
  type EntryType_PhotosListFragment,
  type EntryType_PhotosSingleFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

const limit = 24;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  const { entryCount } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["photos"]
  })) as GetPrerenderDataQuery;

  return Array.from({ length: getTotalPages(entryCount, limit) }, (_, i) => ({
    page: (i + 1).toString()
  })) as RouteParams[];
};

export const load: PageServerLoad = async ({ params }) => {
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * limit || 0;

  const { entries, entryCount } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["photos"],
    limit: limit,
    offset: offset
  })) as { entries?: EntryType_PhotosSingleFragment[]; entryCount: number };

  const totalPages = getTotalPages(entryCount, limit);

  if (entries?.length === 0) {
    redirect(307, `/photos/${totalPages}`);
  }

  const { entries: photosEntry } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["pages"],
    type: "entryPhotosList",
    limit: 1
  })) as { entries?: EntryType_PhotosListFragment[] };

  console.log("Render:", photosEntry?.[0]?.title);

  return {
    photosEntry: photosEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
