import type { RequestHandler } from "./$types";
import { getWorkProjects } from "$graphql/cms-content";
import { renderWork } from "$lib/ai/work";
import { mdResponse, notFound } from "$lib/ai/helpers";

export const GET: RequestHandler = async ({ params }) => {
  const { entries } = await getWorkProjects({ slug: [params.slug], limit: 1, fullContent: true });
  const entry = entries[0];
  return entry ? mdResponse(renderWork(entry)) : notFound();
};
