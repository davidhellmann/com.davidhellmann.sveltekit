import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getPhotosEntriesData, getPhotosListPageEntries } from "$graphql/cms-content";
import {
  getCanonicalFirstPageRedirect,
  getOutOfRangeRedirect,
  getTotalPages,
  parseArchivePage
} from "$lib/routes/archive";

const limit = 24;

export const load: PageServerLoad = async ({ params }) => {
  const page = parseArchivePage(params.page);
  const canonicalRedirect = getCanonicalFirstPageRedirect(page, params.page, "/photos");

  if (canonicalRedirect) {
    redirect(301, canonicalRedirect);
  }

  const offset = (page - 1) * limit;
  const [{ entries, entryCount }, photosEntry] = await Promise.all([
    getPhotosEntriesData({ limit, offset }),
    getPhotosListPageEntries()
  ]);
  const totalPages = getTotalPages(entryCount, limit);
  const outOfRangeRedirect = getOutOfRangeRedirect(page, totalPages, "/photos");

  if (outOfRangeRedirect) {
    redirect(307, outOfRangeRedirect);
  }

  return {
    photosEntry,
    entries,
    entryCount,
    totalPages,
    page
  };
};
