import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getPageByUriEntries } from "$graphql/cms-content";

export const load: PageServerLoad = async ({ params }) => {
  const entries = await getPageByUriEntries(params?.uri);
  if (!entries.length) error(404, "Page not found");

  return {
    entries
  };
};
