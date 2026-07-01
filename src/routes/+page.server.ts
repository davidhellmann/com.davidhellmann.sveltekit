export const prerender = true;
import type { PageServerLoad } from "./$types";
import { getHomeEntries } from "$graphql/cms-content";
import { getBlogArray } from "$lib/data/blog";
import { getWorkArray } from "$lib/data/work";
import { getPhotosArray } from "$lib/data/photos";

// Shuffle array helper
const shuffle = <T>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const load: PageServerLoad = async () => {
  const entries = await getHomeEntries();

  const blogEntries = (await getBlogArray()).slice(0, 3);
  const workEntries = shuffle(await getWorkArray()).slice(0, 4);
  const photoEntries = shuffle(await getPhotosArray()).slice(0, 4);

  return {
    entries: entries,
    blogEntries: blogEntries,
    workEntries: workEntries,
    photoEntries: photoEntries
  };
};
