import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getAboutEntries } from "$graphql/cms-content";

export const load: PageServerLoad = async () => {
  const entries = await getAboutEntries();
  if (!entries.length) error(404, "About page not found");

  return {
    entries
  };
};
