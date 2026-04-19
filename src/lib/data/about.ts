import { GetAboutEntryDocument, type Page_AboutFragment, type GetAboutEntryQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

let cached: Page_AboutFragment | null | undefined;

export const getAboutEntry = async (): Promise<Page_AboutFragment | null> => {
  if (cached !== undefined) return cached;
  const { entries } = (await getGqlData<GetAboutEntryQueryVariables>(GetAboutEntryDocument, {})) as {
    entries?: Page_AboutFragment[];
  };
  cached = entries?.[0] ?? null;
  return cached;
};
