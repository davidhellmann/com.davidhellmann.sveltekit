import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getWorkProjects } from "#lib/graphql/cms-content.js";

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = await getWorkProjects({ slug: [params.slug], limit: 1, fullContent: true });
  const entry = entries[0];
  if (!entry) error(404, "Work entry not found");
  return { entry };
};
