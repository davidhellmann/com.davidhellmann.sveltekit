export const prerender = true;

import type { RequestHandler, EntryGenerator, RouteParams } from "./$types";
import { getBlogArray, getBlogEntry } from "$lib/data/blog";
import { getWorkArray, getWorkEntry } from "$lib/data/work";
import { getAboutEntry } from "$lib/data/about";
import { renderBlog } from "$lib/ai/blog";
import { renderWork } from "$lib/ai/work";
import { renderAbout } from "$lib/ai/about";
import { mdResponse, notFound } from "$lib/ai/helpers";

export const entries: EntryGenerator = async () => {
  const [blog, work] = await Promise.all([getBlogArray(), getWorkArray()]);
  return [
    ...blog.map((e) => ({ uri: `blog/${e.slug}` })),
    ...work.map((e) => ({ uri: `work/${e.slug}` })),
    { uri: "about" }
  ] as RouteParams[];
};

export const GET: RequestHandler = async ({ params }) => {
  const uri = params.uri;

  if (uri === "about") {
    const entry = await getAboutEntry();
    return entry ? mdResponse(renderAbout(entry)) : notFound();
  }

  const [section, slug] = uri.split("/");

  if (section === "blog" && slug) {
    const entry = await getBlogEntry(slug);
    return entry ? mdResponse(renderBlog(entry)) : notFound();
  }

  if (section === "work" && slug) {
    const entry = await getWorkEntry(slug);
    return entry ? mdResponse(renderWork(entry)) : notFound();
  }

  return notFound();
};
