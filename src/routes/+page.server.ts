import type { PageServerLoad } from "./$types";
import { getBlogEntriesData, getHomeEntries, getPhotosEntriesData, getWorkEntriesData } from "$graphql/cms-content";

// Shuffle array helper
const shuffle = <T>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const load: PageServerLoad = async () => {
  const [entries, blog, work, photos] = await Promise.all([
    getHomeEntries(),
    getBlogEntriesData({ limit: 3 }),
    getWorkEntriesData({ limit: 4 }),
    getPhotosEntriesData({ limit: 20 })
  ]);

  const photoEntries = shuffle(photos.entries).slice(0, 4);

  return {
    entries,
    blogEntries: blog.entries,
    workEntries: work.entries,
    photoEntries
  };
};
