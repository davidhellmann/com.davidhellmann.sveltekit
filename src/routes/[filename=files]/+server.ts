import type { RequestHandler } from "./$types";
import { getSeomaticData } from "$graphql/cms-content";

export const GET: RequestHandler = async ({ params }) => {
  const { filename } = params;
  const { seomatic } = await getSeomaticData({
    site: "davidhellmann_com",
    uri: "__home__"
  });

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

    if (template) {
      return new Response(template.contents, {
        headers: { "Content-Type": contentType }
      });
    }
  }

  return new Response("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain"
    }
  });
};
