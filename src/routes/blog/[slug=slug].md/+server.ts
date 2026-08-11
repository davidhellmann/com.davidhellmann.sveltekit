import type { RequestHandler } from "./$types";
import { getBlogPosts } from "$graphql/cms-content";
import { renderBlog } from "$lib/ai/blog";
import { mdResponse, notFound } from "$lib/ai/helpers";

export const GET: RequestHandler = async ({ params }) => {
  const { entries } = await getBlogPosts({ slug: [params.slug], limit: 1, fullContent: true });
  const entry = entries[0];
  return entry ? mdResponse(renderBlog(entry)) : notFound();
};
