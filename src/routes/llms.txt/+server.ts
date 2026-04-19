export const prerender = true;

import type { RequestHandler } from "./$types";
import { getBlogArray } from "$lib/data/blog";
import { getWorkArray } from "$lib/data/work";
import { SITE_URL } from "$lib/ai/helpers";

type Entry = {
  slug?: string | null;
  title?: string | null;
  customTitle?: string | null;
  descriptionPlain?: string | null;
};

const line = (e: Entry, section: "blog" | "work") => {
  const title = e.customTitle?.trim() || e.title?.trim() || e.slug || "Untitled";
  const url = `${SITE_URL}/ai/${section}/${e.slug}.md`;
  const desc = e.descriptionPlain?.trim().replace(/\s+/g, " ");
  return desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`;
};

export const GET: RequestHandler = async () => {
  const [blog, work] = await Promise.all([
    getBlogArray() as Promise<Entry[]>,
    getWorkArray() as Promise<Entry[]>
  ]);

  const body = [
    "# David Hellmann",
    "",
    "> Personal website of David Hellmann — designer, developer, photographer based in Germany. Blog posts on design and engineering, selected work, and an about page with CV and awards.",
    "",
    "Markdown versions of all content live under `/ai/<section>/<slug>.md`.",
    "",
    "## About",
    "",
    `- [About David Hellmann](${SITE_URL}/ai/about.md): CV, awards and biography.`,
    "",
    "## Blog",
    "",
    ...blog.map((e) => line(e, "blog")),
    "",
    "## Work",
    "",
    ...work.map((e) => line(e, "work")),
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
