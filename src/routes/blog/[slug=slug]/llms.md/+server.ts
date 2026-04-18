export const prerender = true;

import type { RequestHandler, EntryGenerator, RouteParams } from "./$types";
import { getBlogEntries, getBlogEntry } from "$lib/data/blog";
import { blocksToMarkdown } from "$utils/blocksToMarkdown";

const SITE_URL = "https://sveltekit.davidhellmann.com";

const escapeYaml = (s: string) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

export const entries: EntryGenerator = async () => {
  const cache = await getBlogEntries();
  return [...cache.keys()].map((slug) => ({ slug })) as RouteParams[];
};

export const GET: RequestHandler = async ({ params }) => {
  const entry = await getBlogEntry(params.slug!);
  if (!entry) {
    return new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });
  }

  const title = entry.customTitle?.trim() || entry.title?.trim() || "Untitled";
  const description = (entry as { descriptionPlain?: string | null }).descriptionPlain?.trim();
  const postDate = (entry as { postDate?: string | null }).postDate;
  const category = (entry as { category?: { title?: string }[] | null }).category?.[0]?.title;
  const topics = ((entry as { topics?: { title?: string }[] | null }).topics ?? [])
    .map((t) => t.title)
    .filter(Boolean);
  const canonical = `${SITE_URL}/blog/${entry.slug}`;

  const frontmatter: string[] = ["---", `title: ${escapeYaml(title)}`];
  if (description) frontmatter.push(`description: ${escapeYaml(description)}`);
  if (postDate) frontmatter.push(`date: ${escapeYaml(postDate)}`);
  if (category) frontmatter.push(`category: ${escapeYaml(category)}`);
  if (topics.length) frontmatter.push(`topics: [${topics.map((t) => escapeYaml(t!)).join(", ")}]`);
  frontmatter.push(`canonical: ${canonical}`);
  frontmatter.push("---");

  const body = blocksToMarkdown(
    (entry as { contentBuilder?: Parameters<typeof blocksToMarkdown>[0] }).contentBuilder
  );

  const md = [
    frontmatter.join("\n"),
    "",
    `# ${title}`,
    "",
    description ?? "",
    "",
    body
  ]
    .filter((s) => s !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });
};
