# Blog RSS Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static RSS 2.0 feed for all blog posts, expose it at `/rss.xml`, preserve `/rss`, and activate the footer RSS link.

**Architecture:** Keep feed generation isolated in `src/lib/rss/` so routes stay thin and the XML logic is unit-tested without CMS/network access. `src/routes/rss.xml/+server.ts` loads cached blog entries and returns rendered RSS XML; `src/routes/rss/+server.ts` returns a permanent redirect response to the canonical feed.

**Tech Stack:** SvelteKit server routes, TypeScript, Vitest, existing GraphQL generated types, existing `getBlogArray()` CMS cache.

---

## File Structure

- Create `src/lib/rss/blog-feed.ts`: pure RSS rendering helpers, blog entry URL/date/author fallback logic, content-builder HTML serialization.
- Create `src/lib/rss/blog-feed.test.ts`: Vitest coverage for XML helpers, dates, absolute URLs, item/channel rendering, and representative content blocks.
- Create `src/lib/rss/response.ts`: small Response helpers for RSS XML and `/rss` redirect responses.
- Create `src/lib/rss/response.test.ts`: Vitest coverage for response headers and redirect behavior.
- Create `src/routes/rss.xml/+server.ts`: prerendered endpoint that loads all blog posts and returns RSS XML.
- Create `src/routes/rss/+server.ts`: prerendered compatibility endpoint returning a 308 redirect to `/rss.xml`.
- Modify `src/lib/components/sections/Footer.svelte`: set RSS link `href="/rss.xml"` and remove planned/disabled state.

## Task 1: RSS Renderer

**Files:**
- Create: `src/lib/rss/blog-feed.test.ts`
- Create: `src/lib/rss/blog-feed.ts`

- [ ] **Step 1: Write failing tests for RSS helpers and rendering**

Create `src/lib/rss/blog-feed.test.ts` with this content:

```ts
import { describe, expect, it } from "vitest";
import {
  cdata,
  escapeXml,
  renderBlogRssFeed,
  renderBlogRssItem,
  renderContentBuilder,
  toAbsoluteUrl,
  toRssDate,
  type BlogFeedEntry
} from "./blog-feed";

const baseEntry = {
  __typename: "page_blogSingle_Entry",
  id: "1",
  uid: "uid-1",
  canonicalId: 1,
  language: "en",
  sectionHandle: "blog",
  typeHandle: "page_blogSingle",
  siteHandle: "davidhellmann_en",
  siteId: 1,
  title: "A title & more",
  slug: "a-title",
  uri: "blog/a-title",
  url: "https://davidhellmann.com/blog/a-title",
  description: "<p>Summary & intro</p>",
  descriptionPlain: "Summary & intro",
  customTitle: "A custom title",
  postDate: "2026-06-30T10:15:00.000Z",
  postDateDay: "30",
  postDateMonth: "6",
  postDateYear: "2026",
  expireDate: null,
  postUpdateDate: "2026-06-30T10:15:00.000Z",
  timezone: "UTC",
  authors: [{ id: "author-1", fullName: "David Hellmann", photo: [] }],
  image: [],
  category: [],
  topics: [],
  prev: [],
  next: [],
  seomatic: null,
  contentBuilder: []
} as unknown as BlogFeedEntry;

describe("RSS XML helpers", () => {
  it("escapes XML text and attribute values", () => {
    expect(escapeXml("Design & <code> \"quotes\" 'single'")).toBe(
      "Design &amp; &lt;code&gt; &quot;quotes&quot; &apos;single&apos;"
    );
  });

  it("wraps CDATA and protects embedded CDATA endings", () => {
    expect(cdata("before ]]> after")).toBe("<![CDATA[before ]]]]><![CDATA[> after]]>");
  });

  it("converts relative URLs to absolute site URLs", () => {
    expect(toAbsoluteUrl("/blog/a-title")).toBe("https://davidhellmann.com/blog/a-title");
    expect(toAbsoluteUrl("blog/a-title")).toBe("https://davidhellmann.com/blog/a-title");
    expect(toAbsoluteUrl("https://example.com/post")).toBe("https://example.com/post");
    expect(toAbsoluteUrl(null)).toBeUndefined();
  });

  it("formats valid dates for RSS and rejects invalid dates", () => {
    expect(toRssDate("2026-06-30T10:15:00.000Z")).toBe("Tue, 30 Jun 2026 10:15:00 GMT");
    expect(toRssDate("not a date")).toBeUndefined();
    expect(toRssDate(null)).toBeUndefined();
  });
});

describe("content builder serialization", () => {
  it("serializes supported block types into feed-reader-friendly HTML", () => {
    const html = renderContentBuilder([
      {
        __typename: "block_text_Entry",
        id: "text-1",
        richText: "<p>Hello <strong>RSS</strong></p>"
      },
      {
        __typename: "block_image_Entry",
        id: "image-1",
        image: [
          {
            url: "/uploads/image.jpg",
            alt: "An image & caption",
            width: 1200,
            height: 800
          }
        ]
      },
      {
        __typename: "block_quote_Entry",
        id: "quote-1",
        quote: "Less but better",
        source: "Dieter Rams",
        hyperLink: [{ url: "https://example.com", text: "Source" }]
      },
      {
        __typename: "block_code_Entry",
        id: "code-1",
        codeSnippetName: "Example",
        codeSnippetDescription: "<p>Small snippet</p>",
        codeSnippet: {
          language: "html",
          value: "<div>escaped</div>"
        }
      },
      {
        __typename: "block_cta_Entry",
        id: "cta-1",
        headline: "Read more",
        description: "<p>Continue here</p>",
        hyperLinks: [{ url: "/about", text: "About" }]
      }
    ]);

    expect(html).toContain("<p>Hello <strong>RSS</strong></p>");
    expect(html).toContain('<img src="https://davidhellmann.com/uploads/image.jpg"');
    expect(html).toContain('alt="An image &amp; caption"');
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<p>Less but better</p>");
    expect(html).toContain('<cite><a href="https://example.com">Dieter Rams</a></cite>');
    expect(html).toContain("<h2>Example</h2>");
    expect(html).toContain("<code>&lt;div&gt;escaped&lt;/div&gt;</code>");
    expect(html).toContain('<a href="https://davidhellmann.com/about">About</a>');
  });
});

describe("blog RSS rendering", () => {
  it("renders one RSS item with summary and full content", () => {
    const item = renderBlogRssItem({
      ...baseEntry,
      contentBuilder: [
        {
          __typename: "block_text_Entry",
          id: "text-1",
          richText: "<p>Full body</p>"
        }
      ]
    });

    expect(item).toContain("<title>A title &amp; more</title>");
    expect(item).toContain("<link>https://davidhellmann.com/blog/a-title</link>");
    expect(item).toContain("<guid>https://davidhellmann.com/blog/a-title</guid>");
    expect(item).toContain("<pubDate>Tue, 30 Jun 2026 10:15:00 GMT</pubDate>");
    expect(item).toContain("<author>David Hellmann</author>");
    expect(item).toContain("<description><![CDATA[<p>Summary & intro</p>]]></description>");
    expect(item).toContain("<content:encoded><![CDATA[<p>Full body</p>]]></content:encoded>");
  });

  it("renders a complete RSS feed with namespaces and newest post date", () => {
    const older = {
      ...baseEntry,
      id: "2",
      title: "Older",
      slug: "older",
      uri: "blog/older",
      url: "https://davidhellmann.com/blog/older",
      postDate: "2025-01-01T00:00:00.000Z"
    };

    const feed = renderBlogRssFeed([older, baseEntry], new Date("2026-07-01T12:00:00.000Z"));

    expect(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(feed).toContain('<rss version="2.0"');
    expect(feed).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(feed).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
    expect(feed).toContain("<title>David Hellmann - Digital Designer &amp; Developer</title>");
    expect(feed).toContain(
      '<atom:link href="https://davidhellmann.com/rss.xml" rel="self" type="application/rss+xml" />'
    );
    expect(feed).toContain("<pubDate>Tue, 30 Jun 2026 10:15:00 GMT</pubDate>");
    expect(feed).toContain("<lastBuildDate>Wed, 01 Jul 2026 12:00:00 GMT</lastBuildDate>");
    expect(feed.indexOf("<title>A title &amp; more</title>")).toBeLessThan(feed.indexOf("<title>Older</title>"));
  });

  it("uses safe fallbacks for incomplete entries", () => {
    const item = renderBlogRssItem({
      ...baseEntry,
      title: "",
      url: "",
      uri: "",
      slug: "fallback-slug",
      postDate: "invalid",
      authors: [],
      description: "",
      descriptionPlain: "Plain summary",
      contentBuilder: []
    });

    expect(item).toContain("<title>Untitled</title>");
    expect(item).toContain("<link>https://davidhellmann.com/blog/fallback-slug</link>");
    expect(item).not.toContain("<pubDate>");
    expect(item).toContain("<author>David Hellmann</author>");
    expect(item).toContain("<description><![CDATA[Plain summary]]></description>");
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm run test -- src/lib/rss/blog-feed.test.ts
```

Expected: FAIL because `src/lib/rss/blog-feed.ts` does not exist.

- [ ] **Step 3: Implement the RSS renderer**

Create `src/lib/rss/blog-feed.ts` with this content:

```ts
import type { Matrix_ContentBuilderFragment, Page_BlogSingleFragment } from "$graphql/graphql";

export type BlogFeedEntry = Page_BlogSingleFragment;

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

export function toAbsoluteUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;

  try {
    return new URL(value, `${SITE_URL}/`).toString();
  } catch {
    return undefined;
  }
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

function getLinkUrl(link: RssLink | null | undefined): string | undefined {
  return toAbsoluteUrl(link?.url || link?.linkUrl);
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

function renderBlock(block: Matrix_ContentBuilderFragment | Record<string, unknown> | null | undefined): string {
  if (!block || typeof block !== "object" || !("__typename" in block)) return "";

  switch (block.__typename) {
    case "block_text_Entry":
      return typeof block.richText === "string" ? block.richText : "";

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

      const name = typeof block.codeSnippetName === "string" && block.codeSnippetName.trim()
        ? `<h2>${escapeXml(block.codeSnippetName)}</h2>`
        : "";
      const description = typeof block.codeSnippetDescription === "string" ? block.codeSnippetDescription : "";
      const language = snippet.language ? ` class="language-${escapeXml(snippet.language)}"` : "";

      return `${name}${description}<pre><code${language}>${escapeXml(snippet.value)}</code></pre>`;
    }

    case "block_cta_Entry": {
      const headline = typeof block.headline === "string" && block.headline.trim()
        ? `<h2>${escapeXml(block.headline)}</h2>`
        : "";
      const description = typeof block.description === "string" ? block.description : "";
      const links = renderLinks(block.hyperLinks as RssLink[] | undefined);

      return `${headline}${description}${links}`;
    }

    default:
      return "";
  }
}

export function renderContentBuilder(
  blocks: readonly (Matrix_ContentBuilderFragment | Record<string, unknown> | null | undefined)[] | null | undefined
): string {
  return (blocks ?? []).map((block) => renderBlock(block)).filter(Boolean).join("");
}

export function renderBlogRssItem(entry: BlogFeedEntry): string {
  const title = escapeXml(getEntryTitle(entry));
  const url = getEntryUrl(entry);
  const pubDate = toRssDate(entry.postDate);
  const summary = getEntrySummary(entry);
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
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
npm run test -- src/lib/rss/blog-feed.test.ts
```

Expected: PASS for `src/lib/rss/blog-feed.test.ts`.

- [ ] **Step 5: Commit the RSS renderer**

Run:

```bash
git add src/lib/rss/blog-feed.ts src/lib/rss/blog-feed.test.ts
git commit -m "feat: add blog rss renderer"
```

Expected: commit succeeds with only the renderer and test files staged.

## Task 2: RSS Response Helpers and Routes

**Files:**
- Create: `src/lib/rss/response.test.ts`
- Create: `src/lib/rss/response.ts`
- Create: `src/routes/rss.xml/+server.ts`
- Create: `src/routes/rss/+server.ts`

- [ ] **Step 1: Write failing tests for response helpers**

Create `src/lib/rss/response.test.ts` with this content:

```ts
import { describe, expect, it } from "vitest";
import { createRssRedirectResponse, createRssXmlResponse } from "./response";

describe("RSS response helpers", () => {
  it("creates an RSS XML response with the correct content type", async () => {
    const response = createRssXmlResponse("<rss></rss>");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    await expect(response.text()).resolves.toBe("<rss></rss>");
  });

  it("creates a permanent compatibility redirect to the canonical feed", () => {
    const response = createRssRedirectResponse();

    expect(response.status).toBe(308);
    expect(response.headers.get("Location")).toBe("/rss.xml");
  });
});
```

- [ ] **Step 2: Run the response helper test and verify it fails**

Run:

```bash
npm run test -- src/lib/rss/response.test.ts
```

Expected: FAIL because `src/lib/rss/response.ts` does not exist.

- [ ] **Step 3: Implement response helpers**

Create `src/lib/rss/response.ts` with this content:

```ts
export function createRssXmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}

export function createRssRedirectResponse(): Response {
  return new Response(null, {
    status: 308,
    headers: {
      Location: "/rss.xml"
    }
  });
}
```

- [ ] **Step 4: Run the response helper test and verify it passes**

Run:

```bash
npm run test -- src/lib/rss/response.test.ts
```

Expected: PASS for `src/lib/rss/response.test.ts`.

- [ ] **Step 5: Add the canonical `/rss.xml` endpoint**

Create `src/routes/rss.xml/+server.ts` with this content:

```ts
export const prerender = true;

import type { RequestHandler } from "./$types";
import { getBlogArray } from "$lib/data/blog";
import { renderBlogRssFeed } from "$lib/rss/blog-feed";
import { createRssXmlResponse } from "$lib/rss/response";

export const GET: RequestHandler = async () => {
  const entries = await getBlogArray();
  return createRssXmlResponse(renderBlogRssFeed(entries));
};
```

- [ ] **Step 6: Add the compatibility `/rss` endpoint**

Create `src/routes/rss/+server.ts` with this content:

```ts
export const prerender = true;

import type { RequestHandler } from "./$types";
import { createRssRedirectResponse } from "$lib/rss/response";

export const GET: RequestHandler = async () => {
  return createRssRedirectResponse();
};
```

- [ ] **Step 7: Run route type checking**

Run:

```bash
npm run check
```

Expected: PASS with no TypeScript or Svelte errors for the new routes.

- [ ] **Step 8: Commit response helpers and routes**

Run:

```bash
git add src/lib/rss/response.ts src/lib/rss/response.test.ts src/routes/rss.xml/+server.ts src/routes/rss/+server.ts
git commit -m "feat: add rss feed routes"
```

Expected: commit succeeds with only response helper, response test, and route files staged.

## Task 3: Footer RSS Link

**Files:**
- Modify: `src/lib/components/sections/Footer.svelte`

- [ ] **Step 1: Update the footer service link data**

In `src/lib/components/sections/Footer.svelte`, replace this entry:

```ts
{ label: "RSS", icon: "rss", planned: true }
```

with this entry:

```ts
{ label: "RSS", href: "/rss.xml", icon: "rss" }
```

- [ ] **Step 2: Verify the planned state is gone**

Run:

```bash
rg -n "RSS feed planned|planned: true|aria-disabled=\\{item.planned" src/lib/components/sections/Footer.svelte
```

Expected: the command may still show generic planned-state rendering because the component type supports planned links, but it must not show `planned: true` on the RSS service link.

- [ ] **Step 3: Run Svelte/TypeScript checks**

Run:

```bash
npm run check
```

Expected: PASS with no Svelte or TypeScript errors.

- [ ] **Step 4: Commit the footer update**

Run:

```bash
git add src/lib/components/sections/Footer.svelte
git commit -m "feat: activate footer rss link"
```

Expected: commit succeeds with only the footer file staged.

## Task 4: Final Verification

**Files:**
- Verify: entire repo

- [ ] **Step 1: Run all unit tests**

Run:

```bash
npm run test
```

Expected: PASS for all Vitest suites, including the new RSS tests.

- [ ] **Step 2: Run project checks**

Run:

```bash
npm run check
```

Expected: PASS with no Svelte or TypeScript errors.

- [ ] **Step 3: Run production build when CMS env is configured**

Run:

```bash
npm run build
```

Expected when `GQL_API_URL` and `GQL_API_TOKEN` are configured: PASS and the static output includes the RSS endpoint. If the command fails because CMS environment variables are missing or network access is unavailable, record that exact blocker in the final implementation report and do not claim build verification passed.

- [ ] **Step 4: Inspect generated feed output when build succeeds**

Run:

```bash
test -f build/rss.xml && sed -n '1,80p' build/rss.xml
```

Expected when build succeeds: output starts with `<?xml version="1.0" encoding="UTF-8"?>`, contains `<rss version="2.0"`, contains `<channel>`, and contains at least one `<item>` when the CMS returns blog entries.

- [ ] **Step 5: Check git status**

Run:

```bash
git status --short
```

Expected: clean working tree after all task commits, or only intentionally uncommitted files that are clearly reported.
