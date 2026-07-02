export const prerender = true;

import type { RequestHandler } from "./$types";
import { createRssRedirectResponse } from "$lib/rss/response";

export const GET: RequestHandler = async () => {
  return createRssRedirectResponse();
};
