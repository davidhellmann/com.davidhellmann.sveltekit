export const prerender = true;
import type { PageServerLoad } from "./$types";
import { getWorkListPageEntries } from "$graphql/cms-content";
import { getWorkArray } from "$lib/data/work";

export const load: PageServerLoad = async () => {
  const workEntries = await getWorkArray();

  const workEntry = await getWorkListPageEntries();

  return {
    workEntry: workEntry,
    workEntries: workEntries
  };
};
