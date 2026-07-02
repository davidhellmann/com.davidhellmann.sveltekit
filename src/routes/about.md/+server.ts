export const prerender = true;

import type { RequestHandler } from "./$types";
import { getAboutEntry } from "$lib/data/about";
import { renderAbout } from "$lib/ai/about";
import { mdResponse, notFound } from "$lib/ai/helpers";

export const GET: RequestHandler = async () => {
  const entry = await getAboutEntry();
  return entry ? mdResponse(renderAbout(entry)) : notFound();
};
