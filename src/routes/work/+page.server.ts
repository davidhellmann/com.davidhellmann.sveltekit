export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetWorkListPageDocument, type GetWorkListPageQueryVariables, type Page_WorkListFragment } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getWorkArray } from "$lib/data/work";

export const load: PageServerLoad = async () => {
  const workEntries = await getWorkArray();

  const { entries: workEntry } = (await getGqlData<GetWorkListPageQueryVariables>(GetWorkListPageDocument, {})) as { entries: Page_WorkListFragment[] };

  return {
    workEntry: workEntry,
    workEntries: workEntries
  };
};
