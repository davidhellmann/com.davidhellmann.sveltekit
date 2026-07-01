export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getBlogEntriesData, getCategoryEntries, getPrerenderData } from "$graphql/cms-content";
import {
  getCanonicalFirstPageRedirect,
  getOutOfRangeRedirect,
  getPagedArchiveRoutes,
  getTotalPages,
  parseArchivePage
} from "$lib/routes/archive";

const limit = 48;

export const entries: EntryGenerator = async () => {
  // Get all categories first
  const { entries: categories } = await getPrerenderData({
    section: ["categories"],
    limit: 999
  });

  const routes: RouteParams[] = [];

  // For each category, generate pages based on entry count
  for (const category of categories || []) {
    if (!category?.slug) continue;

    // Get count of blog entries for this category
    const { entryCount } = await getPrerenderData({
      section: ["blog"],
      relatedToEntries: [
        {
          section: ["categories"],
          slug: [category.slug]
        }
      ]
    });

    const totalPages = getTotalPages(entryCount, limit);

    routes.push(...getPagedArchiveRoutes<RouteParams>(totalPages, { slug: category.slug }));
  }

  return routes;
};

export const load: PageServerLoad = async ({ params }) => {
  const page = parseArchivePage(params.page);
  const offset = (page - 1) * limit || 0;

  const { entries, entryCount } = await getBlogEntriesData({
    relatedToEntries: [
      {
        section: ["categories"],
        slug: [params?.slug]
      }
    ],
    limit: limit,
    offset: offset
  });

  const totalPages = getTotalPages(entryCount, limit);

  const categoryEntry = await getCategoryEntries(params?.slug);
  const canonicalPath = categoryEntry?.[0]?.uri ? `/${categoryEntry[0].uri}` : undefined;
  const canonicalRedirect = getCanonicalFirstPageRedirect(page, params.page, canonicalPath);
  const outOfRangeRedirect = getOutOfRangeRedirect(page, totalPages, canonicalPath);

  // Redirect /slug/1 to /slug
  if (canonicalRedirect) {
    redirect(301, canonicalRedirect);
  }

  if (outOfRangeRedirect) {
    redirect(307, outOfRangeRedirect);
  }

  return {
    categoryEntry: categoryEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
