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
import { detectPreview } from "$utils/detectPreview";

export const entries: EntryGenerator = async () => {
  const { entries } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["blog"],
    limit: 999
  })) as GetPrerenderDataQuery;

  return entries?.map((entry) => {
    if (entry) {
      return {
        slug: entry.slug
      };
    }
  }) as RouteParams[];
};

export const prerender = 'auto';

export const load: PageServerLoad = async (event) => {
  const { params } = event;
  const { isPreview, tokens } = detectPreview(event);
  
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    slug: params?.slug,
    limit: 1,
    includePrevNext: true
  }, tokens)) as GetEntriesQuery;

  console.log("Render:", entries?.[0]?.title, isPreview ? "(Preview)" : "");

  return {
    entries: entries,
    isPreview
  };
};
