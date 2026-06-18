export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getPhotosListPageEntries } from "$graphql/cms-content";
import { getPhotosArray, getPhotosCount } from "$lib/data/photos";
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
  const entryCount = await getPhotosCount();
  const totalPages = getTotalPages(entryCount, limit);
  return getPagedArchiveRoutes<RouteParams>(totalPages);
};

export const load: PageServerLoad = async ({ params }) => {
  const page = parseArchivePage(params.page);
  const canonicalRedirect = getCanonicalFirstPageRedirect(page, params.page, "/photos");

  if (canonicalRedirect) {
    redirect(301, canonicalRedirect);
  }

  // Aus Cache (Build) oder direkt fetchen (Dev)
  const allPhotos = await getPhotosArray();
  const archive = getArchiveWindow(allPhotos, page, limit);
  const outOfRangeRedirect = getOutOfRangeRedirect(page, archive.totalPages, "/photos");

  if (outOfRangeRedirect) {
    redirect(307, outOfRangeRedirect);
  }

  // photosEntry (Page-Metadata) muss separat geholt werden - anderer Type
  const photosEntry = await getPhotosListPageEntries();

  return {
    photosEntry: photosEntry,
    entries: archive.entries,
    entryCount: archive.entryCount,
    totalPages: archive.totalPages,
    page: archive.page
  };
};
