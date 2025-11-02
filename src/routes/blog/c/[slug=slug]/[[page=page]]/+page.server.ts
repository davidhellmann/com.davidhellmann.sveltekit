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
  type EntryType_CategoryFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

const limit = 12;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  // Get all categories first
  const { entries: categories } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["categories"],
    limit: 999
  })) as GetPrerenderDataQuery;

  const routes: RouteParams[] = [];

  // For each category, generate pages based on entry count
  for (const category of categories || []) {
    if (!category?.slug) continue;

    // Get count of blog entries for this category
    const { entryCount } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
      section: ["blog"],
      relatedToEntries: [
        {
          section: ["categories"],
          slug: category.slug
        }
      ]
    })) as GetPrerenderDataQuery;

    const totalPages = getTotalPages(entryCount, limit);

    // Generate routes for each page of this category
    for (let i = 1; i <= totalPages; i++) {
      routes.push({
        slug: category.slug,
        page: i === 1 ? undefined : i.toString()
      });
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
        section: ["categories"],
        slug: params?.slug
      }
    ],
    limit: limit,
    offset: offset
  })) as { entries?: EntryType_BlogSingleFragment[]; entryCount: number };

  const totalPages = getTotalPages(entryCount, limit);

  const { entries: categoryEntry } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["categories"],
    slug: params?.slug,
    limit: 1
  })) as { entries?: EntryType_CategoryFragment[] };

  if (entries?.length === 0) {
    redirect(307, `/${categoryEntry?.[0]?.uri}/${totalPages}`);
  }

  console.log("Renders:", categoryEntry?.[0]?.title);

  return {
    categoryEntry: categoryEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
