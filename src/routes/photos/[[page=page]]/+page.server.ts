export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  GetEntriesDocument,
  type GetEntriesQueryVariables,
  type EntryType_PhotosListFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getPhotosArray, getPhotosCount } from "$lib/data/photos";

const limit = 24;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  const entryCount = await getPhotosCount();
  const routes: RouteParams[] = [];
  const totalPages = getTotalPages(entryCount, limit);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1) {
      routes.push({ page: undefined });
      routes.push({ page: "1" });
    } else {
      routes.push({ page: i.toString() });
    }
  }

  return routes;
};

export const load: PageServerLoad = async ({ params }) => {
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * limit || 0;

  if (page === 1 && params.page === "1") {
    redirect(301, "/photos");
  }

  // Aus Cache statt neu fetchen
  const allPhotos = await getPhotosArray();
  const entries = allPhotos.slice(offset, offset + limit);
  const entryCount = allPhotos.length;
  const totalPages = getTotalPages(entryCount, limit);

  if (entries.length === 0) {
    redirect(307, `/photos/${totalPages}`);
  }

  // photosEntry (Page-Metadata) muss separat geholt werden - anderer Type
  const { entries: photosEntry } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["pages"],
    type: "entryPhotosList",
    limit: 1
  })) as { entries?: EntryType_PhotosListFragment[] };

  console.log("Render:", photosEntry?.[0]?.title, ":", photosEntry?.[0]?.uri);

  return {
    photosEntry: photosEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
