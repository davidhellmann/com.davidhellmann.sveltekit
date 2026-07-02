export const prerender = true;

import type { RequestHandler } from "./$types";
import { getBlogArray } from "$lib/data/blog";
import { renderBlogRssFeed } from "$lib/rss/blog-feed";
import { createRssXmlResponse } from "$lib/rss/response";

export const GET: RequestHandler = async () => {
  const entries = await getBlogArray();
  return createRssXmlResponse(renderBlogRssFeed(entries));
};
