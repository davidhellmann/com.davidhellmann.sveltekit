export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type GetEntriesQueryVariables, type Page_workListFragment } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getWorkArray } from "$lib/data/work";

export const load: PageServerLoad = async () => {
  const workEntries = await getWorkArray();

  const { entries: workEntry } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["pages"],
    type: "page_workList"
  })) as { entries: Page_workListFragment[] };

  return {
    workEntry: workEntry,
    workEntries: workEntries
  };
};
