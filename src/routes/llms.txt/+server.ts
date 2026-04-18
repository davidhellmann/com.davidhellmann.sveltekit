export const prerender = true;

import type { RequestHandler } from "./$types";
import { getBlogArray } from "$lib/data/blog";
import { getWorkArray } from "$lib/data/work";

const SITE_URL = "https://sveltekit.davidhellmann.com";

type LlmsEntry = {
  slug?: string | null;
  title?: string | null;
  customTitle?: string | null;
  uri?: string | null;
  descriptionPlain?: string | null;
};

const line = (e: LlmsEntry, prefix: string) => {
  const title = e.customTitle?.trim() || e.title?.trim() || e.slug || "Untitled";
  const path = e.uri ? `/${e.uri}` : `${prefix}/${e.slug}`;
  const desc = e.descriptionPlain?.trim().replace(/\s+/g, " ");
  return desc ? `- [${title}](${SITE_URL}${path}): ${desc}` : `- [${title}](${SITE_URL}${path})`;
};

export const GET: RequestHandler = async () => {
  const [blog, work] = await Promise.all([
    getBlogArray() as Promise<LlmsEntry[]>,
    getWorkArray() as Promise<LlmsEntry[]>
  ]);

  const body = [
    "# David Hellmann",
    "",
    "> Personal website of David Hellmann — designer, developer, photographer based in Germany. Blog posts on design and engineering, selected work, and photo galleries.",
    "",
    "## Blog",
    "",
    ...blog.map((e) => line(e, "/blog")),
    "",
    "## Work",
    "",
    ...work.map((e) => line(e, "/work")),
    "",
    "## Pages",
    "",
    `- [About](${SITE_URL}/about): About David Hellmann.`,
    `- [Photos](${SITE_URL}/photos): Photo galleries.`,
    "",
    "## Optional",
    "",
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    ""
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
