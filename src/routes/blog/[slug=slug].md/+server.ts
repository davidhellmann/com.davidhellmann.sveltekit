import type { RequestHandler } from "./$types";
import { getBlogPosts } from "#lib/graphql/cms-content.js";
import { renderBlog } from "#lib/ai/blog.js";
import { mdResponse, notFound } from "#lib/ai/helpers.js";

export const GET: RequestHandler = async ({ params }) => {
  const { entries } = await getBlogPosts({ slug: [params.slug], limit: 1, fullContent: true });
  const entry = entries[0];
  return entry ? mdResponse(renderBlog(entry)) : notFound();
};
