import { sequence } from "@sveltejs/kit/hooks";
import { type Handle } from "@sveltejs/kit";

const preloadFonts: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    preload: ({ type, path }) => {
      // Fontsource-CSS listet pro Schnitt woff2 + legacy woff. Nur woff2
      // vorladen, sonst zieht SvelteKit die ungenutzte woff-Fallback mit.
      if (type === "font") return path.endsWith(".woff2");
      return type === "js" || type === "css";
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
