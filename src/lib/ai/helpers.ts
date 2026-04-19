export const SITE_URL = "https://sveltekit.davidhellmann.com";

export const escapeYaml = (s: string) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

type FrontmatterInput = Record<string, string | number | string[] | null | undefined>;

export const frontmatter = (data: FrontmatterInput): string => {
  const lines = ["---"];
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      if (!value.length) continue;
      lines.push(`${key}: [${value.map((v) => escapeYaml(v)).join(", ")}]`);
    } else if (typeof value === "number") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${escapeYaml(String(value))}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
};

type Asset = {
  url?: string | null;
  alt?: string | null;
  title?: string | null;
  caption?: string | null;
};

/** Image only rendered if alt or caption carries information. */
export const imageMd = (a: Asset | null | undefined): string => {
  if (!a?.url) return "";
  const alt = a.alt?.trim() || a.title?.trim() || "";
  const caption = a.caption?.trim();
  if (!alt && !caption) return ""; // pure decoration — skip
  const img = `![${alt}](${a.url})`;
  return caption ? `${img}\n\n*${caption}*` : img;
};

/** Rich text / CKEditor HTML passes through verbatim (Markdown allows raw HTML).
 *  Wrapped in blank lines so Markdown doesn't parse it inline. */
export const htmlBlock = (html: string | null | undefined): string => {
  if (!html?.trim()) return "";
  return `\n${html.trim()}\n`;
};

type HyperLink = {
  url?: string | null;
  text?: string | null;
  linkText?: string | null;
};

export const linkMd = (h: HyperLink | null | undefined): string => {
  if (!h?.url) return "";
  const label = h.text?.trim() || h.linkText?.trim() || h.url;
  return `[${label}](${h.url})`;
};

export const join = (parts: (string | null | undefined)[]): string =>
  parts
    .map((p) => p?.trim())
    .filter((p): p is string => Boolean(p))
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n");

export const mdResponse = (body: string) =>
  new Response(body.trim() + "\n", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });

export const notFound = () =>
  new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });

// --- ContentBuilder block renderer ---------------------------------------

type Block = { __typename?: string; [key: string]: unknown };

const renderBlock = (block: Block): string => {
  switch (block.__typename) {
    case "block_text_Entry":
      return htmlBlock(block.richText as string | null);

    case "block_code_Entry": {
      const snippet = block.codeSnippet as { language?: string; value?: string } | null;
      const lang = snippet?.language ?? "";
      const value = (snippet?.value ?? "").replace(/\n+$/, "");
      const name = block.codeSnippetName as string | null;
      const desc = block.codeSnippetDescription as string | null;
      return join([
        name ? `**${name}**` : null,
        desc,
        `\`\`\`${lang}\n${value}\n\`\`\``
      ]);
    }

    case "block_quote_Entry": {
      const quote = (block.quote as string | null)?.trim();
      const source = (block.source as string | null)?.trim();
      const link = linkMd(block.hyperLink as HyperLink | null);
      if (!quote) return "";
      const attribution = link || source;
      return attribution ? `> ${quote}\n>\n> — ${attribution}` : `> ${quote}`;
    }

    case "block_image_Entry": {
      const img = block.image as Asset[] | Asset | null;
      return imageMd(Array.isArray(img) ? img[0] : img);
    }

    case "block_images_Entry": {
      const images = (block.images as Asset[] | null) ?? [];
      return images.map(imageMd).filter(Boolean).join("\n\n");
    }

    case "block_cta_Entry": {
      const headline = (block.headline as string | null)?.trim();
      const description = (block.description as string | null)?.trim();
      const links = ((block.hyperLinks as HyperLink[] | null) ?? []).map(linkMd).filter(Boolean);
      return join([
        headline ? `### ${headline}` : null,
        description,
        links.length ? links.join(" · ") : null
      ]);
    }

    default:
      return "";
  }
};

export const renderBlocks = (blocks: Block[] | null | undefined): string =>
  blocks?.length ? join(blocks.map(renderBlock)) : "";
