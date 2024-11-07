export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import {
  GetEntriesDocument,
  type GetEntriesQuery,
  type GetEntriesQueryVariables,
  GetPrerenderDataDocument,
  type GetPrerenderDataQueryVariables,
  type GetPrerenderDataQuery
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const entries: EntryGenerator = async () => {
  const { entries } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["pages"],
    limit: 999
  })) as GetPrerenderDataQuery;

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
  })) as GetEntriesQuery;

  console.log(`start: [${params?.uri}]`);
  console.log(entries);
  console.log(`end: [${params?.uri}]`);

  return {
    entries: entries
  };
};
