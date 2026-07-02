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
  const [blog, work] = await Promise.all([getBlogArray() as Promise<Entry[]>, getWorkArray() as Promise<Entry[]>]);
  const latestBlog = blog.slice(0, 12);

  const body = [
    "# David Hellmann",
    "",
    "> Personal website of David Hellmann — designer, developer, photographer based in Germany. Blog posts on design and engineering, selected work, and an about page with CV and awards.",
    "",
    "Markdown versions of the primary content live under `/ai/<section>/<slug>.md`. This file is intentionally curated for quick LLM context; the complete index is available at `/llms-full.txt`.",
    "",
    "## About",
    "",
    `- [About David Hellmann](${SITE_URL}/ai/about.md): CV, awards and biography.`,
    "",
    "## Recent Blog Posts",
    "",
    ...latestBlog.map((e) => line(e, "blog")),
    "",
    "## Selected Work",
    "",
    ...work.map((e) => line(e, "work")),
    "",
    "## Optional",
    "",
    `- [Full LLM content index](${SITE_URL}/llms-full.txt): Complete list of blog and work markdown resources.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    ""
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
