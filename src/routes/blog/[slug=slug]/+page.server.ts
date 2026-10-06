import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getBlogPosts } from "#lib/graphql/cms-content.js";

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = await getBlogPosts({ slug: [params.slug], limit: 1, fullContent: true });
  const entry = entries[0];
  if (!entry) error(404, "Blog post not found");
  return { entry };
};
