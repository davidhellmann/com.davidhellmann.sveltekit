export const prerender = true;
import type { PageServerLoad } from "./$types";
import {
  GetEntriesDocument,
  type GetEntriesQuery,
  type GetEntriesQueryVariables,
  type Entry_DataFragment,
  type Entry_SeoFragment,
  type EntryType_BlogSingleFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["work"],
    limit: 999
  })) as GetEntriesQuery;

  const { entries: workEntry } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["pages"],
    type: "entryWorkList"
  })) as GetEntriesQuery;

  console.log("Render:", entries?.[0]?.title);

  return {
    workEntry: workEntry,
    entries: entries as (Entry_DataFragment & Entry_SeoFragment & EntryType_BlogSingleFragment)[]
  };
};
