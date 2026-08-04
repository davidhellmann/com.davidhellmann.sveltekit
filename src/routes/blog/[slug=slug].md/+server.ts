import type { RequestHandler } from "./$types";
import { getBlogEntriesData } from "$graphql/cms-content";
import { renderBlog } from "$lib/ai/blog";
import { mdResponse, notFound } from "$lib/ai/helpers";

export const GET: RequestHandler = async ({ params }) => {
  const { entries } = await getBlogEntriesData({ slug: [params.slug!], limit: 1, fullContent: true });
  const entry = entries[0];
  return entry ? mdResponse(renderBlog(entry)) : notFound();
};
