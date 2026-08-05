import type { PageServerLoad } from "./$types";
import { getBlogEntriesData, getHomeEntries, getPhotosEntriesData, getWorkEntriesData } from "$graphql/cms-content";

export const load: PageServerLoad = async () => {
  const [entries, blog, work, photos] = await Promise.all([
    getHomeEntries(),
    getBlogEntriesData({ limit: 3, fullContent: false }),
    getWorkEntriesData({ limit: 4, fullContent: false }),
    getPhotosEntriesData({ limit: 4, fullContent: false })
  ]);

  return {
    entries,
    blogEntries: blog.entries,
    workEntries: work.entries,
    photoEntries: photos.entries
  };
};
