import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getBlogEntriesData, getBlogListPageEntries } from "$graphql/cms-content";
import {
  getCanonicalFirstPageRedirect,
  getOutOfRangeRedirect,
  getTotalPages,
  parseArchivePage
} from "$lib/routes/archive";

const limit = 24;

export const load: PageServerLoad = async ({ params }) => {
  const page = parseArchivePage(params.page);
  const canonicalRedirect = getCanonicalFirstPageRedirect(page, params.page, "/blog");

  if (canonicalRedirect) {
    redirect(301, canonicalRedirect);
  }

  const offset = (page - 1) * limit;
  const [{ entries, entryCount }, blogEntry] = await Promise.all([
    getBlogEntriesData({ limit, offset, fullContent: false }),
    getBlogListPageEntries()
  ]);
  const totalPages = getTotalPages(entryCount, limit);
  const outOfRangeRedirect = getOutOfRangeRedirect(page, totalPages, "/blog");

  if (outOfRangeRedirect) {
    redirect(307, outOfRangeRedirect);
  }

  return {
    blogEntry,
    entries,
    entryCount,
    totalPages,
    page
  };
};
