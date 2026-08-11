import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getPhotoGalleries } from "$graphql/cms-content";

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = await getPhotoGalleries({ slug: [params.slug], limit: 1, fullContent: true });
  const entry = entries[0];
  if (!entry) error(404, "Photo gallery not found");
  return { entry };
};
