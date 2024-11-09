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
    section: ["work"],
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

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["work"],
    slug: params?.slug,
    limit: 1,
    includePrevNext: true
  })) as GetEntriesQuery;

  console.log(`start: work/[${params?.slug}]`);
  console.log(entries);
  console.log(`end: work/[${params?.slug}]`);

  return {
    entries: entries
  };
};
