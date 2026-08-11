import type { RequestHandler } from "./$types";
import { getBlogPosts } from "$graphql/cms-content";
import { renderBlogRssFeed } from "$lib/rss/blog-feed";
import { createRssXmlResponse } from "$lib/rss/response";

export const GET: RequestHandler = async () => {
  const { entries } = await getBlogPosts({ limit: 20, fullContent: true });
  return createRssXmlResponse(renderBlogRssFeed(entries));
};
