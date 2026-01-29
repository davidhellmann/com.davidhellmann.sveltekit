export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  GetEntriesDocument,
  type GetEntriesQueryVariables,
  GetPrerenderDataDocument,
  type GetPrerenderDataQueryVariables,
  type GetPrerenderDataQuery,
  type EntryType_BlogSingleFragment,
  type EntryType_TopicFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

const limit = 48;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  // Get all topics first
  const { entries: topics } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["topics"],
    limit: 999
  })) as GetPrerenderDataQuery;

  const routes: RouteParams[] = [];

  // For each category, generate pages based on entry count
  for (const category of topics || []) {
    if (!category?.slug) continue;

    // Get count of blog entries for this category
    const { entryCount } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
      section: ["blog"],
      relatedToEntries: [
        {
          section: ["topics"],
          slug: [category.slug]
        }
      ]
    })) as GetPrerenderDataQuery;

    const totalPages = getTotalPages(entryCount, limit);

    // Generate routes for each page of this topic
    for (let i = 1; i <= totalPages; i++) {
      // Generate both /slug and /slug/1 for page 1
      if (i === 1) {
        routes.push({
          slug: category.slug,
          page: undefined
        });
        routes.push({
          slug: category.slug,
          page: "1"
        });
      } else {
        routes.push({
          slug: category.slug,
          page: i.toString()
        });
      }
    }
  }

  return routes;
};

export const load: PageServerLoad = async ({ params }) => {
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * limit || 0;

  const { entries, entryCount } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    relatedToEntries: [
      {
        section: ["topics"],
        slug: [params?.slug]
      }
    ],
    limit: limit,
    offset: offset
  })) as { entries?: EntryType_BlogSingleFragment[]; entryCount: number };

  const totalPages = getTotalPages(entryCount, limit);

  const { entries: topicEntry } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["topics"],
    slug: params?.slug,
    limit: 1
  })) as { entries?: EntryType_TopicFragment[] };

  // Redirect /slug/1 to /slug
  if (page === 1 && params.page === "1" && topicEntry?.[0]?.uri) {
    redirect(301, `/${topicEntry[0].uri}`);
  }

  if (entries?.length === 0) {
    redirect(307, `/${topicEntry?.[0]?.uri}/${totalPages}`);
  }


  return {
    topicEntry: topicEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
