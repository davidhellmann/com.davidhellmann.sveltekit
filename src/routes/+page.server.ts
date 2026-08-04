import type { PageServerLoad } from "./$types";
import { getBlogEntriesData, getHomeEntries, getPhotosEntriesData, getWorkEntriesData } from "$graphql/cms-content";

// Shuffle array helper
const shuffle = <T>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const load: PageServerLoad = async () => {
  const [entries, blog, work, photos] = await Promise.all([
    getHomeEntries(),
    getBlogEntriesData({ limit: 3, fullContent: false }),
    getWorkEntriesData({ limit: 4, fullContent: false }),
    getPhotosEntriesData({ limit: 20, fullContent: false })
  ]);

  const photoEntries = shuffle(photos.entries).slice(0, 4);

  return {
    entries,
    blogEntries: blog.entries,
    workEntries: work.entries,
    photoEntries
  };
};
