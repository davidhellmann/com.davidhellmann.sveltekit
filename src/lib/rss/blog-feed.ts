import type { Matrix_ContentBuilderFragment, Page_BlogSingleFragment } from "$graphql/graphql";
import { parse } from "node-html-parser";

export type BlogFeedEntry = Page_BlogSingleFragment;

type FeedContentBlock = BlogFeedEntry["contentBuilder"][number] | Matrix_ContentBuilderFragment | null | undefined;
type RenderableContentBlock = FeedContentBlock | Record<string, unknown>;

type RssLink = {
  url?: string | null;
  linkUrl?: string | null;
  text?: string | null;
  linkText?: string | null;
  title?: string | null;
};

type FeedImage = {
  url?: string | null;
  alt?: string | null;
  title?: string | null;
  width?: number | string | null;
  height?: number | string | null;
};

const SITE_URL = "https://davidhellmann.com";
const FEED_URL = `${SITE_URL}/rss.xml`;
const CHANNEL_TITLE = "David Hellmann - Digital Designer & Developer";
const CHANNEL_DESCRIPTION =
  "David is a self-taught Digital Designer & Developer with over fifteen years work experience. Currently he is working @fredmansky";
const URL_PROTOCOL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const SITE_URL_OBJECT = new URL(SITE_URL);

export function escapeXml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function cdata(value: unknown): string {
  return `<![CDATA[${String(value ?? "").replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function toSafeUrl(value: string | null | undefined, allowedProtocols: readonly string[]): string | undefined {
  if (!value) return undefined;

  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;

  try {
    const isAbsolute = URL_PROTOCOL_PATTERN.test(trimmedValue);
    const url = isAbsolute ? new URL(trimmedValue) : new URL(trimmedValue, `${SITE_URL}/`);

    if (!allowedProtocols.includes(url.protocol)) return undefined;

    if (isAbsolute && url.origin !== SITE_URL_OBJECT.origin) return trimmedValue;

    return url.toString();
  } catch {
    return undefined;
  }
}

export function toAbsoluteUrl(value: string | null | undefined): string | undefined {
  return toSafeUrl(value, ["http:", "https:"]);
}

function toLinkUrl(value: string | null | undefined): string | undefined {
  return toSafeUrl(value, ["http:", "https:", "mailto:"]);
}

export function toRssDate(value: unknown): string | undefined {
  if (!value) return undefined;

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toUTCString();
}

function getEntryTitle(entry: BlogFeedEntry): string {
  return entry.title?.trim() || "Untitled";
}

function getEntryUrl(entry: BlogFeedEntry): string {
  const url = toAbsoluteUrl(entry.url);
  if (url) return url;

  const uri = toAbsoluteUrl(entry.uri);
  if (uri) return uri;

  const slug = entry.slug?.trim();
  return toAbsoluteUrl(slug ? `/blog/${slug}` : "/blog") ?? `${SITE_URL}/blog`;
}

function getEntryAuthor(entry: BlogFeedEntry): string {
  return entry.authors?.[0]?.fullName?.trim() || "David Hellmann";
}

function getEntrySummary(entry: BlogFeedEntry): string {
  return entry.description?.trim() || entry.descriptionPlain?.trim() || "";
}

function normalizeHtmlUrls(html: string): string {
  if (!html) return "";

  const root = parse(html);

  root.querySelectorAll("[href]").forEach((element) => {
    const href = toLinkUrl(element.getAttribute("href"));
    if (href) {
      element.setAttribute("href", href);
    } else {
      element.removeAttribute("href");
    }
  });

  root.querySelectorAll("[src]").forEach((element) => {
    const src = toAbsoluteUrl(element.getAttribute("src"));
    if (src) {
      element.setAttribute("src", src);
    } else {
      element.removeAttribute("src");
    }
  });

  return root.toString();
}

function getLinkUrl(link: RssLink | null | undefined): string | undefined {
  return toLinkUrl(link?.url || link?.linkUrl);
}

function getLinkText(link: RssLink | null | undefined): string {
  return link?.text?.trim() || link?.linkText?.trim() || link?.title?.trim() || getLinkUrl(link) || "Link";
}

function renderImage(image: FeedImage | null | undefined): string {
  const src = toAbsoluteUrl(image?.url);
  if (!src) return "";

  const alt = image?.alt || image?.title || "";
  const width = image?.width ? ` width="${escapeXml(image.width)}"` : "";
  const height = image?.height ? ` height="${escapeXml(image.height)}"` : "";

  return `<figure><img src="${escapeXml(src)}" alt="${escapeXml(alt)}"${width}${height} /></figure>`;
}

function renderLinks(links: readonly (RssLink | null | undefined)[] | null | undefined): string {
  const items =
    links
      ?.map((link) => {
        const href = getLinkUrl(link);
        if (!href) return "";
        return `<li><a href="${escapeXml(href)}">${escapeXml(getLinkText(link))}</a></li>`;
      })
      .filter(Boolean) ?? [];

  return items.length ? `<ul>${items.join("")}</ul>` : "";
}

function renderBlock(block: RenderableContentBlock): string {
  if (!block || typeof block !== "object" || !("__typename" in block)) return "";

  switch (block.__typename) {
    case "block_text_Entry":
      return typeof block.richText === "string" ? normalizeHtmlUrls(block.richText) : "";

    case "block_image_Entry":
      return renderImage((block.image as FeedImage[] | undefined)?.[0]);

    case "block_images_Entry":
      return ((block.images as FeedImage[] | undefined) ?? []).map((image) => renderImage(image)).join("");

    case "block_quote_Entry": {
      if (typeof block.quote !== "string" || !block.quote.trim()) return "";

      const link = (block.hyperLink as RssLink[] | undefined)?.[0];
      const href = getLinkUrl(link);
      const source = typeof block.source === "string" ? block.source.trim() : "";
      const cite = source
        ? href
          ? `<cite><a href="${escapeXml(href)}">${escapeXml(source)}</a></cite>`
          : `<cite>${escapeXml(source)}</cite>`
        : "";

      return `<blockquote><p>${escapeXml(block.quote)}</p>${cite}</blockquote>`;
    }

    case "block_code_Entry": {
      const snippet = block.codeSnippet as { language?: string | null; value?: string | null } | null | undefined;
      if (!snippet?.value) return "";

      const name =
        typeof block.codeSnippetName === "string" && block.codeSnippetName.trim()
          ? `<h2>${escapeXml(block.codeSnippetName)}</h2>`
          : "";
      const description =
        typeof block.codeSnippetDescription === "string" ? normalizeHtmlUrls(block.codeSnippetDescription) : "";
      const language = snippet.language ? ` class="language-${escapeXml(snippet.language)}"` : "";

      return `${name}${description}<pre><code${language}>${escapeXml(snippet.value)}</code></pre>`;
    }

    case "block_cta_Entry": {
      const headline =
        typeof block.headline === "string" && block.headline.trim() ? `<h2>${escapeXml(block.headline)}</h2>` : "";
      const description = typeof block.description === "string" ? normalizeHtmlUrls(block.description) : "";
      const links = renderLinks(block.hyperLinks as RssLink[] | undefined);

      return `${headline}${description}${links}`;
    }

    default:
      return "";
  }
}

export function renderContentBuilder(blocks: readonly RenderableContentBlock[] | null | undefined): string {
  return (blocks ?? [])
    .map((block) => renderBlock(block))
    .filter(Boolean)
    .join("");
}

export function renderBlogRssItem(entry: BlogFeedEntry): string {
  const title = escapeXml(getEntryTitle(entry));
  const url = getEntryUrl(entry);
  const pubDate = toRssDate(entry.postDate);
  const summary = normalizeHtmlUrls(getEntrySummary(entry));
  const content = renderContentBuilder(entry.contentBuilder);

  return [
    "    <item>",
    `      <title>${title}</title>`,
    `      <link>${escapeXml(url)}</link>`,
    pubDate ? `      <pubDate>${escapeXml(pubDate)}</pubDate>` : "",
    `      <author>${escapeXml(getEntryAuthor(entry))}</author>`,
    `      <guid>${escapeXml(url)}</guid>`,
    `      <description>${cdata(summary)}</description>`,
    content ? `      <content:encoded>${cdata(content)}</content:encoded>` : "",
    "    </item>"
  ]
    .filter(Boolean)
    .join("\n");
}

function sortEntriesByPostDate(entries: readonly BlogFeedEntry[]): BlogFeedEntry[] {
  return [...entries].sort((a, b) => {
    const aDate = new Date(String(a.postDate ?? "")).getTime();
    const bDate = new Date(String(b.postDate ?? "")).getTime();
    return (Number.isNaN(bDate) ? 0 : bDate) - (Number.isNaN(aDate) ? 0 : aDate);
  });
}

export function renderBlogRssFeed(entries: readonly BlogFeedEntry[], buildDate = new Date()): string {
  const sortedEntries = sortEntriesByPostDate(entries);
  const newestPostDate = sortedEntries.map((entry) => toRssDate(entry.postDate)).find(Boolean);
  const lastBuildDate = buildDate.toUTCString();
  const items = sortedEntries.map((entry) => renderBlogRssItem(entry)).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    "  <channel>",
    `    <title>${escapeXml(CHANNEL_TITLE)}</title>`,
    `    <link>${SITE_URL}/</link>`,
    `    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />`,
    `    <description>${escapeXml(CHANNEL_DESCRIPTION)}</description>`,
    "    <language>en-us</language>",
    `    <pubDate>${escapeXml(newestPostDate ?? lastBuildDate)}</pubDate>`,
    `    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>"
  ]
    .filter(Boolean)
    .join("\n");
}
