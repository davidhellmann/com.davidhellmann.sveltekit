export const prerender = true;
import type { PageServerLoad } from "./$types";
import {
  GetEntriesDocument,
  type GetEntriesQuery,
  type GetEntriesQueryVariables,
  type Entry_DataFragment,
  type Entry_SeoFragment,
  type EntryType_WorkSingleFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async () => {
  const { entries: workEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["work"],
    limit: 999
  })) as GetEntriesQuery;

  const { entries: workEntry } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["pages"],
    type: "entryWorkList"
  })) as GetEntriesQuery;

  console.log("Render:", workEntry?.[0]?.title);

  return {
    workEntry: workEntry,
    workEntries: workEntries as (Entry_DataFragment & Entry_SeoFragment & EntryType_WorkSingleFragment)[]
  };
};
