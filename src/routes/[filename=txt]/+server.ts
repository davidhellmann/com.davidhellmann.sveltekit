export const prerender = true;
import type { RequestHandler } from "./$types";
import { GetEntriesDocument, type GetEntriesQuery, type GetEntriesQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const GET: RequestHandler = async ({ params }) => {
  const { filename } = params;
  const { entries } = (await getGqlData<GetEntriesQueryVariables>(GetEntriesDocument, {
    section: ["home"]
  })) as GetEntriesQuery;

  if (entries && entries[0] && filename) {
    const template = entries[0]?.seomatic?.frontendTemplates?.find((item) => item.filename === filename);

    return new Response(template?.contents, {
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  return new Response("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain"
    }
  });
};
