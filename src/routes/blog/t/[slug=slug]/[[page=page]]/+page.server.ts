import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { getBlogEntriesData, getTopicEntries } from "$graphql/cms-content";
import {
  getCanonicalFirstPageRedirect,
  getOutOfRangeRedirect,
  getTotalPages,
  parseArchivePage
} from "$lib/routes/archive";

const limit = 48;

export const load: PageServerLoad = async ({ params }) => {
  const page = parseArchivePage(params.page);
  const offset = (page - 1) * limit || 0;

  const [{ entries, entryCount }, topicEntry] = await Promise.all([
    getBlogEntriesData({
      relatedToEntries: [
        {
          section: ["topics"],
          slug: [params?.slug]
        }
      ],
      limit,
      offset,
      fullContent: false
    }),
    getTopicEntries(params?.slug)
  ]);

  if (!topicEntry.length) error(404, "Blog topic not found");

  const totalPages = getTotalPages(entryCount, limit);

  const canonicalPath = topicEntry?.[0]?.uri ? `/${topicEntry[0].uri}` : undefined;
  const canonicalRedirect = getCanonicalFirstPageRedirect(page, params.page, canonicalPath);
  const outOfRangeRedirect = getOutOfRangeRedirect(page, totalPages, canonicalPath);

  // Redirect /slug/1 to /slug
  if (canonicalRedirect) {
    redirect(301, canonicalRedirect);
  }

  if (outOfRangeRedirect) {
    redirect(307, outOfRangeRedirect);
  }

  return {
    topicEntry,
    entries,
    entryCount,
    totalPages,
    page
  };
};
