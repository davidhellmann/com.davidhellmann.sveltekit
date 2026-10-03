import type { RequestHandler } from "./$types";
import { getBlogPosts } from "#lib/graphql/cms-content.js";
import { renderBlogRssFeed } from "#lib/rss/blog-feed.js";
import { createRssXmlResponse } from "#lib/rss/response.js";

export const GET: RequestHandler = async () => {
  const { entries } = await getBlogPosts({ limit: 20, fullContent: true });
  return createRssXmlResponse(renderBlogRssFeed(entries));
};
