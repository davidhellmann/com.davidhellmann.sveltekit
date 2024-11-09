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
    section: ["pages"],
    type: "entryWorkList"
  })) as GetEntriesQuery;

  console.log("start: work");
  console.log(entries);
  console.log("end: work");

  return {
    entries: entries as (Entry_DataFragment & Entry_SeoFragment & EntryType_BlogSingleFragment)[]
  };
};
