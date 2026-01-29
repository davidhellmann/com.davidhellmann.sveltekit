export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type EntryType_HomeFragment, type GetEntriesQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getBlogArray } from "$lib/data/blog";
import { getWorkArray } from "$lib/data/work";
import { getPhotosArray } from "$lib/data/photos";

// Shuffle array helper
const shuffle = <T>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["home"],
    limit: 1
  })) as { entries?: EntryType_HomeFragment[] };

  const blogEntries = (await getBlogArray()).slice(0, 3);
  const workEntries = shuffle(await getWorkArray()).slice(0, 4);
  const photoEntries = shuffle(await getPhotosArray()).slice(0, 4);

  console.log("Render:", entries?.[0]?.title, ":", entries?.[0]?.uri);

  return {
    entries: entries,
    blogEntries: blogEntries,
    workEntries: workEntries,
    photoEntries: photoEntries
  };
};
