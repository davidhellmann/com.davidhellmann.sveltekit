export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getBlogListPageEntries } from "$graphql/cms-content";
import { getBlogArray, getBlogCount } from "$lib/data/blog";
import {
  getArchiveWindow,
  getCanonicalFirstPageRedirect,
  getOutOfRangeRedirect,
  getPagedArchiveRoutes,
  getTotalPages,
  parseArchivePage
} from "$lib/routes/archive";

const limit = 24;

export const entries: EntryGenerator = async () => {
  const entryCount = await getBlogCount();
  const totalPages = getTotalPages(entryCount, limit);
  return getPagedArchiveRoutes<RouteParams>(totalPages);
};

export const load: PageServerLoad = async ({ params }) => {
  const page = parseArchivePage(params.page);
  const canonicalRedirect = getCanonicalFirstPageRedirect(page, params.page, "/blog");

  if (canonicalRedirect) {
    redirect(301, canonicalRedirect);
  }

  const allBlog = await getBlogArray();
  const archive = getArchiveWindow(allBlog, page, limit);
  const outOfRangeRedirect = getOutOfRangeRedirect(page, archive.totalPages, "/blog");

  if (outOfRangeRedirect) {
    redirect(307, outOfRangeRedirect);
  }

  // blogEntry (Page-Metadata) muss separat geholt werden - anderer Type
  const blogEntry = await getBlogListPageEntries();

  return {
    blogEntry: blogEntry,
    entries: archive.entries,
    entryCount: archive.entryCount,
    totalPages: archive.totalPages,
    page: archive.page
  };
};
