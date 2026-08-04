import type { RequestHandler } from "./$types";
import { getWorkEntriesData } from "$graphql/cms-content";
import { renderWork } from "$lib/ai/work";
import { mdResponse, notFound } from "$lib/ai/helpers";

export const GET: RequestHandler = async ({ params }) => {
  const { entries } = await getWorkEntriesData({ slug: [params.slug!], limit: 1, fullContent: true });
  const entry = entries[0];
  return entry ? mdResponse(renderWork(entry)) : notFound();
};
