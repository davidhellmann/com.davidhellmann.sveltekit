export function createRssXmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}

export function createRssRedirectResponse(): Response {
  return new Response(null, {
    status: 308,
    headers: {
      Location: "/rss.xml"
    }
  });
}
