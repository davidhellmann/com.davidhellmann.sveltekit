export const prerender = true;

import type { RequestHandler } from "./$types";
import { SITE_URL } from "$lib/ai/helpers";
import { getBlogArray } from "$lib/data/blog";
import { getWorkArray } from "$lib/data/work";

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

  const body = [
    "# David Hellmann Full LLM Index",
    "",
    "> Complete markdown index for David Hellmann's personal website. Use `/llms.txt` for a shorter curated entry point.",
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
    ""
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
