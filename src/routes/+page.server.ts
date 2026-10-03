import type { PageServerLoad } from "./$types";
import { getBlogPosts, getHome, getPhotoGalleries, getWorkProjects } from "#lib/graphql/cms-content.js";

export const load: PageServerLoad = async () => {
  const [entry, blog, work, photos] = await Promise.all([
    getHome(),
    getBlogPosts({ limit: 3, fullContent: false }),
    getWorkProjects({ limit: 4, fullContent: false }),
    getPhotoGalleries({ limit: 4, fullContent: false })
  ]);

  return {
    entry,
    blogEntries: blog.entries,
    workEntries: work.entries,
    photoEntries: photos.entries
  };
};
