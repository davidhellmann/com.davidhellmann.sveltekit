export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { getPageByUriEntries, getPrerenderData } from "$graphql/cms-content";

export const entries: EntryGenerator = async () => {
  const { entries } = await getPrerenderData({
    section: ["pages"],
    limit: 999
  });

  return entries?.map((entry) => {
    if (entry) {
      return {
        uri: entry.uri
      };
    }
  }) as RouteParams[];
};

export const load: PageServerLoad = async ({ params }) => {
  const entries = await getPageByUriEntries(params?.uri);

  return {
    entries: entries
  };
};
