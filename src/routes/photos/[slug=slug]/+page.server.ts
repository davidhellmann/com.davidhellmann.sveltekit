export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { getPhotosEntries, getPhotosEntry } from "$lib/data/photos";

export const entries: EntryGenerator = async () => {
  const cache = await getPhotosEntries();
  return [...cache.keys()].map((slug) => ({ slug })) as RouteParams[];
};

export const load: PageServerLoad = async ({ params }) => {
  const entry = await getPhotosEntry(params.slug!);
  return {
    entries: entry ? [entry] : []
  };
};
