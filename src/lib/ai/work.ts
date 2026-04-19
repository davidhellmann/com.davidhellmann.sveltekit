import type { Page_WorkSingleFragment } from "$graphql/graphql";
import { SITE_URL, frontmatter, imageMd, linkMd, renderBlocks, join } from "./helpers";

export const renderWork = (entry: Page_WorkSingleFragment): string => {
  const title = entry.customTitle?.trim() || entry.title?.trim() || "Untitled";
  const description = entry.descriptionPlain?.trim();
  const client = entry.client?.[0]?.title ?? null;
  const agency = entry.agency?.[0]?.title ?? null;
  const workType = entry.workType?.[0]?.title ?? null;
  const workAreas = (entry.workAreas ?? []).map((a) => a?.title).filter((t): t is string => Boolean(t));
  const projectLink = linkMd(entry.projectLink?.[0]);

  const fm = frontmatter({
    title,
    description,
    date: entry.postDate,
    client,
    agency,
    workType,
    workAreas,
    canonical: `${SITE_URL}/work/${entry.slug}`,
    section: "work"
  });

  const meta: string[] = [];
  if (client) meta.push(`**Client:** ${client}`);
  if (agency) meta.push(`**Agency:** ${agency}`);
  if (workType) meta.push(`**Type:** ${workType}`);
  if (workAreas.length) meta.push(`**Areas:** ${workAreas.join(", ")}`);
  if (projectLink) meta.push(`**Project:** ${projectLink}`);

  const projectDescription = (entry.projectDescription as string | null)?.trim();
  const clientWords = (entry.clientWords as string | null)?.trim();

  const hero = imageMd(Array.isArray(entry.image) ? entry.image[0] : entry.image);
  const body = renderBlocks(entry.contentBuilderWork as Parameters<typeof renderBlocks>[0]);

  return join([
    fm,
    `# ${title}`,
    description,
    meta.length ? meta.join("  \n") : null,
    projectDescription ? `## Project\n\n${projectDescription}` : null,
    clientWords ? `## In the client's words\n\n> ${clientWords}` : null,
    hero,
    body
  ]);
};
