import { sequence } from "@sveltejs/kit/hooks";
import { type Handle } from "@sveltejs/kit";

const preloadFonts: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    preload: ({ type }) => {
      return type === "font" || type === "js" || type === "css";
    }
  });
};

const redirectSitemap: Handle = async ({ event, resolve }) => {
  if (event.url.pathname === "/sitemap.xml") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/sitemaps-1-sitemap.xml"
      }
    });
  }

  return resolve(event);
};

export const handle = sequence(preloadFonts, redirectSitemap);
