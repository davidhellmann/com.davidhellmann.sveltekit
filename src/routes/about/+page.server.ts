export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetAboutEntryDocument, type Page_AboutFragment, type GetAboutEntryQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetAboutEntryQueryVariables>(GetAboutEntryDocument, {})) as { entries?: Page_AboutFragment[] };

  return {
    entries: entries
  };
};
