export const prerender = true;
import type { RequestHandler } from "./$types";
import { GetSeomaticDocument, type GetSeomaticQuery, type GetSeomaticQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const GET: RequestHandler = async ({ params }) => {
  const { filename } = params;
  const { seomatic } = (await getGqlData<GetSeomaticQueryVariables>(GetSeomaticDocument, {
    site: "davidhellmann_com",
    uri: "__home__"
  })) as GetSeomaticQuery;

  if (seomatic && filename) {
    const template = seomatic.frontendTemplates?.find((item) => item.filename === filename);

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

export const entries = async () => {
  const { seomatic } = (await getGqlData<GetSeomaticQueryVariables>(GetSeomaticDocument, {
    site: "davidhellmann_com",
    uri: "__home__"
  })) as GetSeomaticQuery;

  // Rückgabe als Array von Objekten, die dem RouteParams-Typ entsprechen
  return (
    seomatic?.frontendTemplates?.map((template) => ({
      filename: template.filename
    })) ?? []
  );
};
