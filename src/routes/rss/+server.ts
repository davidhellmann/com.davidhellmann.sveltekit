import type { RequestHandler } from "./$types";
import { createRssRedirectResponse } from "#lib/rss/response.js";

export const GET: RequestHandler = async () => {
  return createRssRedirectResponse();
};
