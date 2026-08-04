import type { PageServerLoad } from "./$types";
import { getWorkEntriesData, getWorkListPageEntries } from "$graphql/cms-content";

export const load: PageServerLoad = async () => {
  const [workEntry, work] = await Promise.all([
    getWorkListPageEntries(),
    getWorkEntriesData({ limit: -1, fullContent: false })
  ]);

  return {
    workEntry,
    workEntries: work.entries
  };
};
