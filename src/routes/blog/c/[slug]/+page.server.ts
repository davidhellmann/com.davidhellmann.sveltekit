import type { PageServerLoad } from "./$types";
import { GetEntriesDocument, type GetEntriesQuery, type GetEntriesQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["categories"],
    slug: params.slug,
    limit: 1
  })) as GetEntriesQuery;

  const { entries: blogEntries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["blog"],
    relatedToEntries: [
      {
        section: ["categories"],
        slug: [params.slug]
      }
    ]
  })) as GetEntriesQuery;

  console.log(`start: blog/c/[${params.slug}]`);
  console.log(entries, blogEntries);
  console.log(`end: blog/c/[${params.slug}]`);

  return {
    entries,
    blogEntries
  };
};
