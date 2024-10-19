import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type GetEntriesQuery, type GetEntriesQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get("p") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "10");
  const offset = (page - 1) * limit;

  const { entries, entryCount } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    limit: limit,
    offset: offset
  })) as GetEntriesQuery;

  return {
    entries: entries,
    entryCount: entryCount,
    limit: limit,
    page: page,
  };
};
