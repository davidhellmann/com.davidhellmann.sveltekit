export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type GetEntriesQuery, type GetEntriesQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

import { GetHomeQuery, GetHomeResult, GetHomeVariables } from "./query";

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["home"]
  })) as GetEntriesQuery;

  const { entry } = (await getGqlData(GetHomeQuery, {
    section: ["home"]
  } as GetHomeVariables)) as GetHomeResult;
  console.log(entry);

  const { entries: blogEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    limit: 3
  })) as GetEntriesQuery;

  const { entries: workEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["work"],
    limit: null,
    orderBy: "RAND()"
  })) as GetEntriesQuery;

  const { entries: photoEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["photos"],
    limit: 5,
    orderBy: "RAND()"
  })) as GetEntriesQuery;

  console.log("Render:", entries?.[0]?.title);

  return {
    entries: entries,
    blogEntries: blogEntries,
    workEntries: workEntries,
    photoEntries: photoEntries
  };
};
