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
    expect(toAbsoluteUrl("https://example.com/a b")).toBe("https://example.com/a%20b");
    expect(toAbsoluteUrl("   ")).toBeUndefined();
    expect(toAbsoluteUrl("javascript:alert(1)")).toBeUndefined();
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
    expect(html).toContain('<cite><a href="https://example.com/">Dieter Rams</a></cite>');
    expect(html).toContain("<h2>Example</h2>");
    expect(html).toContain('<code class="language-html">&lt;div&gt;escaped&lt;/div&gt;</code>');
    expect(html).toContain('<a href="https://davidhellmann.com/about">About</a>');
  });

  it("normalizes safe embedded URLs and removes unsafe embedded URL attributes", () => {
    const html = renderContentBuilder([
      {
        __typename: "block_text_Entry",
        id: "text-1",
        richText:
          '<p><a href="/about">About</a><img src="/uploads/image.jpg" alt="Image"><a href="javascript:alert(1)">Bad link</a><img src="javascript:alert(1)" alt="Bad image"></p>'
      },
      {
        __typename: "block_code_Entry",
        id: "code-1",
        codeSnippetName: "Example",
        codeSnippetDescription: '<p><a href="/blog">Blog</a><img src="javascript:alert(1)" alt="Bad image"></p>',
        codeSnippet: {
          language: "html",
          value: "<div>escaped</div>"
        }
      },
      {
        __typename: "block_cta_Entry",
        id: "cta-1",
        headline: "Read more",
        description:
          '<p><a href="/work">Work</a><img src="/uploads/cta.jpg" alt="CTA"><a href="javascript:alert(1)">Bad CTA</a></p>',
        hyperLinks: [{ url: "mailto:hello@example.com", text: "Email" }]
      }
    ]);

    expect(html).toContain('<a href="https://davidhellmann.com/about">About</a>');
    expect(html).toContain('<img src="https://davidhellmann.com/uploads/image.jpg" alt="Image">');
    expect(html).toContain("<a>Bad link</a>");
    expect(html).toContain('<img alt="Bad image">');
    expect(html).toContain('<a href="https://davidhellmann.com/blog">Blog</a>');
    expect(html).toContain('<a href="https://davidhellmann.com/work">Work</a>');
    expect(html).toContain('<img src="https://davidhellmann.com/uploads/cta.jpg" alt="CTA">');
    expect(html).toContain('<a href="mailto:hello@example.com">Email</a>');
    expect(html).not.toContain("javascript:");
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
    } as unknown as BlogFeedEntry);

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

  it("falls back to the slug URL when entry URL fields are whitespace", () => {
    const item = renderBlogRssItem({
      ...baseEntry,
      url: "   ",
      uri: "   ",
      slug: "fallback-slug"
    });

    expect(item).toContain("<link>https://davidhellmann.com/blog/fallback-slug</link>");
    expect(item).toContain("<guid>https://davidhellmann.com/blog/fallback-slug</guid>");
  });

  it("normalizes embedded URLs in item descriptions and removes unsafe attributes", () => {
    const item = renderBlogRssItem({
      ...baseEntry,
      description:
        '<p><a href="/about">About</a><img src="/uploads/summary.jpg" alt="Summary"><a href="javascript:alert(1)">Bad link</a><img src="javascript:alert(1)" alt="Bad image"></p>',
      descriptionPlain: ""
    });

    expect(item).toContain('<a href="https://davidhellmann.com/about">About</a>');
    expect(item).toContain('<img src="https://davidhellmann.com/uploads/summary.jpg" alt="Summary">');
    expect(item).toContain("<a>Bad link</a>");
    expect(item).toContain('<img alt="Bad image">');
    expect(item).not.toContain("javascript:");
  });

  it("keeps embedded CDATA endings safe in full item content", () => {
    const item = renderBlogRssItem({
      ...baseEntry,
      contentBuilder: [
        {
          __typename: "block_text_Entry",
          id: "text-1",
          richText: "<p>before ]]> after</p>"
        }
      ]
    } as unknown as BlogFeedEntry);

    expect(item).toContain("<content:encoded><![CDATA[<p>before ]]]]><![CDATA[> after</p>]]></content:encoded>");
  });
});
