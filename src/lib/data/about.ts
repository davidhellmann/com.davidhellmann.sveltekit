import { GetAboutEntryDocument, type Page_AboutFragment, type GetAboutEntryQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const getAboutEntry = async (): Promise<Page_AboutFragment | null> => {
  const { entries } = (await getGqlData<GetAboutEntryQueryVariables>(GetAboutEntryDocument, {})) as {
    entries?: Page_AboutFragment[];
  };
  return entries?.[0] ?? null;
};
