export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { getWorkEntries, getWorkEntry } from "$lib/data/work";

export const entries: EntryGenerator = async () => {
  const cache = await getWorkEntries();
  return [...cache.keys()].map((slug) => ({ slug })) as RouteParams[];
};

export const load: PageServerLoad = async ({ params }) => {
  const entry = await getWorkEntry(params.slug!);
  console.log("Render:", entry?.title, ":", entry?.uri);
  return {
    entries: entry ? [entry] : []
  };
};
