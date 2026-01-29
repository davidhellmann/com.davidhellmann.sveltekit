export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type GetEntriesQueryVariables, type EntryType_WorkListFragment } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getWorkArray } from "$lib/data/work";

export const load: PageServerLoad = async () => {
  const workEntries = await getWorkArray();

  const { entries: workEntry } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["pages"],
    type: "entryWorkList"
  })) as { entries: EntryType_WorkListFragment[] };

  console.log("Render:", workEntry?.[0]?.title, ":", workEntry?.[0]?.uri);

  return {
    workEntry: workEntry,
    workEntries: workEntries
  };
};
