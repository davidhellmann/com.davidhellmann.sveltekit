export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getBlogEntriesData, getPrerenderData, getTopicEntries } from "$graphql/cms-content";
import {
  getCanonicalFirstPageRedirect,
  getOutOfRangeRedirect,
  getPagedArchiveRoutes,
  getTotalPages,
  parseArchivePage
} from "$lib/routes/archive";

const limit = 48;

export const entries: EntryGenerator = async () => {
  // Get all topics first
  const { entries: topics } = await getPrerenderData({
    section: ["topics"],
    limit: 999
  });

  const routes: RouteParams[] = [];

  // For each category, generate pages based on entry count
  for (const category of topics || []) {
    if (!category?.slug) continue;

    // Get count of blog entries for this category
    const { entryCount } = await getPrerenderData({
      section: ["blog"],
      relatedToEntries: [
        {
          section: ["topics"],
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
        section: ["topics"],
        slug: [params?.slug]
      }
    ],
    limit: limit,
    offset: offset
  });

  const totalPages = getTotalPages(entryCount, limit);

  const topicEntry = await getTopicEntries(params?.slug);
  const canonicalPath = topicEntry?.[0]?.uri ? `/${topicEntry[0].uri}` : undefined;
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
    topicEntry: topicEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
