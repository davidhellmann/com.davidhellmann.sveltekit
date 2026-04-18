import { htmlToMarkdown } from "./htmlToMarkdown";

type Block = {
  __typename?: string;
  [key: string]: unknown;
};

type Asset = {
  url?: string | null;
  alt?: string | null;
  title?: string | null;
  caption?: string | null;
};

type HyperLink = {
  url?: string | null;
  text?: string | null;
  linkText?: string | null;
};

const imageMd = (a: Asset) => {
  if (!a?.url) return "";
  const alt = a.alt || a.title || "";
  const caption = a.caption?.trim();
  const img = `![${alt}](${a.url})`;
  return caption ? `${img}\n*${caption}*` : img;
};

const linkMd = (h: HyperLink | null | undefined) => {
  if (!h?.url) return "";
  const label = h.text || h.linkText || h.url;
  return `[${label}](${h.url})`;
};

const renderBlock = (block: Block): string => {
  switch (block.__typename) {
    case "block_text_Entry":
      return htmlToMarkdown(block.richText as string | null);

    case "block_code_Entry": {
      const snippet = block.codeSnippet as { language?: string; value?: string } | null;
      const lang = snippet?.language ?? "";
      const value = (snippet?.value ?? "").replace(/\n+$/, "");
      const name = block.codeSnippetName as string | null;
      const desc = block.codeSnippetDescription as string | null;
      const parts: string[] = [];
      if (name) parts.push(`**${name}**`);
      if (desc) parts.push(desc);
      parts.push(`\`\`\`${lang}\n${value}\n\`\`\``);
      return parts.join("\n\n");
    }

    case "block_quote_Entry": {
      const quote = (block.quote as string | null)?.trim();
      const source = (block.source as string | null)?.trim();
      const link = linkMd(block.hyperLink as HyperLink | null);
      if (!quote) return "";
      const attribution = link || source;
      return attribution ? `> ${quote}\n>\n> — ${attribution}` : `> ${quote}`;
    }

    case "block_image_Entry":
      return imageMd((block.image as Asset[] | Asset | null) instanceof Array
        ? (block.image as Asset[])[0]
        : (block.image as Asset));

    case "block_images_Entry": {
      const images = (block.images as Asset[] | null) ?? [];
      return images.map(imageMd).filter(Boolean).join("\n\n");
    }

    case "block_cta_Entry": {
      const headline = (block.headline as string | null)?.trim();
      const description = (block.description as string | null)?.trim();
      const links = ((block.hyperLinks as HyperLink[] | null) ?? []).map(linkMd).filter(Boolean);
      const parts: string[] = [];
      if (headline) parts.push(`### ${headline}`);
      if (description) parts.push(description);
      if (links.length) parts.push(links.join(" · "));
      return parts.join("\n\n");
    }

    case "block_award_Entry": {
      const award = block.award as string | null;
      const date = block.date as string | null;
      const company = (block.company as { title?: string }[] | null)?.[0]?.title;
      const link = linkMd(block.hyperLink as HyperLink | null);
      const parts = [award, company, date].filter(Boolean).join(" — ");
      return link ? `- ${parts} (${link})` : `- ${parts}`;
    }

    case "block_curriculumVitae_Entry": {
      const company = (block.company as { title?: string }[] | null)?.[0]?.title;
      const position = block.position as string | null;
      const location = block.location as string | null;
      const start = block.dateStart as string | null;
      const end = (block.currentPosition ? "present" : (block.dateEnd as string | null)) ?? "";
      const head = [position, company, location].filter(Boolean).join(" · ");
      const dates = [start, end].filter(Boolean).join(" – ");
      return `- **${head}** _(${dates})_`;
    }

    default:
      return "";
  }
};

export const blocksToMarkdown = (blocks: Block[] | null | undefined): string => {
  if (!blocks?.length) return "";
  return blocks.map(renderBlock).filter(Boolean).join("\n\n").trim();
};
