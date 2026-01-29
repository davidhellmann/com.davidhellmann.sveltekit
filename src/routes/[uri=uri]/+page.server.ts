export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import {
  GetEntriesDocument,
  type GetEntriesQueryVariables,
  GetPrerenderDataDocument,
  type GetPrerenderDataQueryVariables,
  type EntryType_ContentBuilderFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const entries: EntryGenerator = async () => {
  const { entries } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["pages"],
    limit: 999
  })) as { entries?: EntryType_ContentBuilderFragment[] };

  return entries?.map((entry) => {
    if (entry) {
      return {
        uri: entry.uri
      };
    }
  }) as RouteParams[];
};

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["pages"],
    uri: params?.uri
  })) as { entries?: EntryType_ContentBuilderFragment[] };


  return {
    entries: entries
  };
};
