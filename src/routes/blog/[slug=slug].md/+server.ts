export const prerender = true;

import type { RequestHandler, EntryGenerator, RouteParams } from "./$types";
import { getBlogEntries, getBlogEntry } from "$lib/data/blog";
import { renderBlog } from "$lib/ai/blog";
import { mdResponse, notFound } from "$lib/ai/helpers";

export const entries: EntryGenerator = async () => {
  const cache = await getBlogEntries();
  return [...cache.keys()].map((slug) => ({ slug })) as RouteParams[];
};

export const GET: RequestHandler = async ({ params }) => {
  const entry = await getBlogEntry(params.slug!);
  return entry ? mdResponse(renderBlog(entry)) : notFound();
};
