export const prerender = true;
import type { PageServerLoad } from "./$types";
import {
  GetEntriesDocument,
  type EntryType_BlogSingleFragment,
  type EntryType_WorkSingleFragment,
  type EntryType_PhotosSingleFragment,
  type EntryType_HomeFragment,
  type GetEntriesQueryVariables
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["home"],
    limit: 1
  })) as { entries?: EntryType_HomeFragment[] };

  const { entries: blogEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    limit: 3
  })) as { entries?: EntryType_BlogSingleFragment[] };

  const { entries: workEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["work"],
    limit: 4,
    orderBy: "RAND()"
  })) as { entries?: EntryType_WorkSingleFragment[] };

  const { entries: photoEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["photos"],
    limit: 8,
    orderBy: "RAND()"
  })) as { entries?: EntryType_PhotosSingleFragment[] };

  console.log("Render:", entries?.[0]?.title);

  return {
    entries: entries,
    blogEntries: blogEntries,
    workEntries: workEntries,
    photoEntries: photoEntries
  };
};
