export const prerender = true;
import type { PageServerLoad } from "./$types";
import { getAboutEntries } from "$graphql/cms-content";

export const load: PageServerLoad = async () => {
  const entries = await getAboutEntries();

  return {
    entries: entries
  };
};
