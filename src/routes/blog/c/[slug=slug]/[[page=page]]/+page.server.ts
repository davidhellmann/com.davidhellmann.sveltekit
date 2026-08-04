import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { getBlogEntriesData, getCategoryEntries } from "$graphql/cms-content";
import {
  getCanonicalFirstPageRedirect,
  getOutOfRangeRedirect,
  getTotalPages,
  parseArchivePage
} from "$lib/routes/archive";

const limit = 48;

export const load: PageServerLoad = async ({ params }) => {
  const page = parseArchivePage(params.page);
  const offset = (page - 1) * limit || 0;

  const [{ entries, entryCount }, categoryEntry] = await Promise.all([
    getBlogEntriesData({
      relatedToEntries: [
        {
          section: ["categories"],
          slug: [params?.slug]
        }
      ],
      limit,
      offset,
      fullContent: false
    }),
    getCategoryEntries(params?.slug)
  ]);

  if (!categoryEntry.length) error(404, "Blog category not found");

  const totalPages = getTotalPages(entryCount, limit);

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
    categoryEntry,
    entries,
    entryCount,
    totalPages,
    page
  };
};
