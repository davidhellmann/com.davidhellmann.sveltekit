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
  type Entry_DataFragment,
  type Entry_SeoFragment,
  type EntryType_BlogDetailFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

const limit = 12;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  const { entryCount } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["blog"]
  })) as GetPrerenderDataQuery;

  return Array.from({ length: getTotalPages(entryCount, limit) }, (_, i) => ({
    page: (i + 1).toString()
  })) as RouteParams[];
};

export const load: PageServerLoad = async ({ params }) => {
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * limit || 0;

  const { entries, entryCount } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    limit: limit,
    offset: offset
  })) as GetEntriesQuery;

  const totalPages = getTotalPages(entryCount, limit);

  if (entries?.length === 0) {
    redirect(307, `/blog/${totalPages}`);
  }

  console.log(`start: blog/[${page}]`);
  console.log(entries, entryCount, totalPages, page);
  console.log(`end: blog/[${page}]`);

  return {
    entries: entries as (Entry_DataFragment & Entry_SeoFragment & EntryType_BlogDetailFragment)[],
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
