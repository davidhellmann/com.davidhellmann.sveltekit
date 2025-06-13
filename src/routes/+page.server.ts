import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type GetEntriesQuery, type GetEntriesQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { detectPreview, getPrerender } from "$utils/detectPreview";

export const prerender = 'auto';

export const load: PageServerLoad = async (event) => {
  const { isPreview, tokens } = detectPreview(event);
  
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["home"]
  }, tokens)) as GetEntriesQuery;

  const { entries: blogEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    limit: 3
  }, tokens)) as GetEntriesQuery;

  const { entries: workEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["work"],
    limit: 4,
    orderBy: "RAND()"
  }, tokens)) as GetEntriesQuery;

  const { entries: photoEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["photos"],
    limit: 8,
    orderBy: "RAND()"
  }, tokens)) as GetEntriesQuery;

  console.log("Render:", entries?.[0]?.title);

  return {
    entries: entries,
    blogEntries: blogEntries,
    workEntries: workEntries,
    photoEntries: photoEntries
  };
};
