export const prerender = true;

import type { RequestHandler, EntryGenerator, RouteParams } from "./$types";
import { getWorkEntries, getWorkEntry } from "$lib/data/work";
import { renderWork } from "$lib/ai/work";
import { mdResponse, notFound } from "$lib/ai/helpers";

export const entries: EntryGenerator = async () => {
  const cache = await getWorkEntries();
  return [...cache.keys()].map((slug) => ({ slug })) as RouteParams[];
};

export const GET: RequestHandler = async ({ params }) => {
  const entry = await getWorkEntry(params.slug!);
  return entry ? mdResponse(renderWork(entry)) : notFound();
};
