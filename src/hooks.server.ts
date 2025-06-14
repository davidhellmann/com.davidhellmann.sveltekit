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

const securityHeaders: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  // Security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Allow iframe embedding for preview routes, otherwise restrict
  if (event.url.pathname.startsWith('/preview') || event.url.searchParams.has('x-craft-live-preview')) {
    response.headers.set('X-Frame-Options', 'ALLOWALL');
  } else {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }
  
  return response;
};

export const handle = sequence(preloadFonts, redirectSitemap, securityHeaders);