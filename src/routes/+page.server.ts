import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type GetEntriesQuery, type GetEntriesQueryVariables } from "$lib/graphql/graphql";
import { getGqlData } from "$lib/graphql/graphql-client";

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"]
  })) as GetEntriesQuery;

  return {
    entries: entries
  };
};
