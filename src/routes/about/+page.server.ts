export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type Page_AboutFragment, type GetEntriesQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["pages"],
    slug: "about",
    limit: 1
  })) as { entries?: Page_AboutFragment[] };

  return {
    entries: entries
  };
};
