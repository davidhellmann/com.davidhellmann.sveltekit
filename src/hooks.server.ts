import { sequence } from "@sveltejs/kit/hooks";
import { type Handle } from "@sveltejs/kit";

const criticalFontPaths = ["hinted-Geomanist-Ultra", "poppins-latin-700-normal", "bitter-latin-wght-normal"] as const;

export const shouldPreloadAsset = (type: string, path: string) => {
  if (type === "font") {
    return path.endsWith(".woff2") && criticalFontPaths.some((fontPath) => path.includes(fontPath));
  }

  return type === "js" || type === "css";
};

const preloadFonts: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    preload: ({ type, path }) => shouldPreloadAsset(type, path)
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
