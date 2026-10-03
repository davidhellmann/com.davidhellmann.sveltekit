import type { RequestHandler } from "./$types";
import { getWorkProjects } from "#lib/graphql/cms-content.js";
import { renderWork } from "#lib/ai/work.js";
import { mdResponse, notFound } from "#lib/ai/helpers.js";

export const GET: RequestHandler = async ({ params }) => {
  const { entries } = await getWorkProjects({ slug: [params.slug], limit: 1, fullContent: true });
  const entry = entries[0];
  return entry ? mdResponse(renderWork(entry)) : notFound();
};
