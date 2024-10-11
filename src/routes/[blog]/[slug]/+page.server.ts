import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type GetEntriesQuery, type GetEntriesQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    uri: Object.values(params).join("/"),
    limit: 1
  })) as GetEntriesQuery;

  return {
    entries: entries
  };
};
