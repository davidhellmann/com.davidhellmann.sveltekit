import type { Page_BlogSingleFragment } from "$graphql/graphql";
import { SITE_URL, frontmatter, imageMd, renderBlocks, join } from "./helpers";

export const renderBlog = (entry: Page_BlogSingleFragment): string => {
  const title = entry.customTitle?.trim() || entry.title?.trim() || "Untitled";
  const description = entry.descriptionPlain?.trim();
  const category = entry.category?.[0]?.title ?? null;
  const topics = (entry.topics ?? []).map((t) => t?.title).filter((t): t is string => Boolean(t));

  const fm = frontmatter({
    title,
    description,
    date: entry.postDate,
    category,
    topics,
    canonical: `${SITE_URL}/blog/${entry.slug}`,
    section: "blog"
  });

  const hero = imageMd(Array.isArray(entry.image) ? entry.image[0] : entry.image);
  const body = renderBlocks(entry.contentBuilder as Parameters<typeof renderBlocks>[0]);

  return join([fm, `# ${title}`, description, hero, body]);
};
