import type { PageServerLoad } from "./$types";
import {
  GetEntriesDocument,
  type GetEntriesQuery,
  type GetEntriesQueryVariables,
  type Entry_DataFragment,
  type Entry_SeoFragment,
  type EntryType_BlogDetailFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get("p") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "12");
  const offset = (page - 1) * limit || 0;

  const { entries, entryCount } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    limit: limit,
    offset: offset
  })) as GetEntriesQuery;

  const totalPages: number = Math.ceil(entryCount / limit);

  return {
    entries: entries as (Entry_DataFragment & Entry_SeoFragment & EntryType_BlogDetailFragment)[],
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
