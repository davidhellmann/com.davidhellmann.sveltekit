import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getAbout } from "#lib/graphql/cms-content.js";

export const load: PageServerLoad = async () => {
  const entry = await getAbout();
  if (!entry) error(404, "About page not found");

  return { entry };
};
