import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getWorkEntriesData } from "$graphql/cms-content";

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = await getWorkEntriesData({ slug: [params.slug!], limit: 1 });
  const entry = entries[0];
  if (!entry) error(404, "Work entry not found");
  return {
    entries
  };
};
