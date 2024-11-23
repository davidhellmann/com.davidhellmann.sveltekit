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
    const templates = [
      ...(seomatic.frontendTemplates ?? []),
      ...(seomatic.sitemapIndexes ?? []),
      ...(seomatic.sitemaps ?? []),
      ...(seomatic.sitemapStyles?.filename ? [seomatic.sitemapStyles] : [])
    ];

    const template = templates.find((item) => item.filename === filename);
    const contentType = ["xsl", "xml"].includes(filename.split(".").pop()?.toLowerCase() || "")
      ? "application/xml"
      : "text/plain";

    return new Response(template?.contents, {
      headers: { "Content-Type": contentType }
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

  if (!seomatic) return [];

  const { frontendTemplates, sitemapIndexes, sitemapStyles, sitemaps } = seomatic;

  return [
    ...(frontendTemplates?.map((template) => ({ filename: template.filename })) ?? []),
    ...(sitemapIndexes?.map((template) => ({ filename: template.filename })) ?? []),
    ...(sitemaps?.map((template) => ({ filename: template.filename })) ?? []),
    ...(sitemapStyles?.filename ? [{ filename: sitemapStyles.filename }] : [])
  ];
};
