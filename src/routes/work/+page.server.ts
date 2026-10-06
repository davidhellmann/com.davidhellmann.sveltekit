import type { PageServerLoad } from "./$types";
import { getWorkList, getWorkProjects } from "#lib/graphql/cms-content.js";

export const load: PageServerLoad = async () => {
  const [workEntry, work] = await Promise.all([getWorkList(), getWorkProjects({ limit: 100, fullContent: false })]);

  return {
    workEntry,
    workEntries: work.entries
  };
};
