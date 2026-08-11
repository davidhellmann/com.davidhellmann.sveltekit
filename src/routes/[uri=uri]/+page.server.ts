import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getPageByUri } from "$graphql/cms-content";

export const load: PageServerLoad = async ({ params }) => {
  const entry = await getPageByUri(params.uri);
  if (!entry) error(404, "Page not found");

  return { entry };
};
