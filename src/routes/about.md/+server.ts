import type { RequestHandler } from "./$types";
import { getAboutEntry } from "#lib/data/about.js";
import { renderAbout } from "#lib/ai/about.js";
import { mdResponse, notFound } from "#lib/ai/helpers.js";

export const GET: RequestHandler = async () => {
  const entry = await getAboutEntry();
  return entry ? mdResponse(renderAbout(entry)) : notFound();
};
