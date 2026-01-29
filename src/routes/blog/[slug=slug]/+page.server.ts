export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { getBlogEntries, getBlogEntry } from "$lib/data/blog";

export const entries: EntryGenerator = async () => {
  const cache = await getBlogEntries();
  return [...cache.keys()].map((slug) => ({ slug })) as RouteParams[];
};

export const load: PageServerLoad = async ({ params }) => {
  const entry = await getBlogEntry(params.slug!);
  console.log("Render:", entry?.title, ":", entry?.uri);
  return {
    entries: entry ? [entry] : []
  };
};
