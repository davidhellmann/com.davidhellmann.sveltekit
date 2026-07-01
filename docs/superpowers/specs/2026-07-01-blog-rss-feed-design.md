# Blog RSS Feed Design

## Context

The site has a footer RSS entry that is currently marked as planned. Blog content already comes from the CMS through typed GraphQL fragments and is cached through `getBlogArray()`. The project builds as a static SvelteKit site with manual prerendering, so the RSS feed should be generated at build time and emitted as static XML.

The old site exposes `https://davidhellmann.com/rss` as an RSS 2.0 feed with full blog content. The new implementation should keep that intent while using clearer route naming and standards-compatible RSS extensions.

## Scope

Build a blog RSS feed that:

- Publishes all blog posts, not only a recent subset.
- Exposes the canonical feed at `/rss.xml`.
- Keeps `/rss` available for compatibility with the old URL.
- Activates the existing footer RSS link.
- Includes full content where the existing CMS block data can be serialized safely.
- Remains compatible with the static adapter and prerendered build.

This design does not add Atom or JSON Feed endpoints, CMS-side feed templates, or new CMS fields.

## Architecture

Add a small RSS module under `src/lib/rss/` that converts blog entries into XML strings. The module should own XML escaping, CDATA wrapping, absolute URL handling, date formatting, channel rendering, item rendering, and content-builder block serialization.

Add a SvelteKit server route at `src/routes/rss.xml/+server.ts`:

- `prerender = true`
- Load all blog entries with `getBlogArray()`.
- Sort entries by post date descending.
- Render RSS XML through the RSS module.
- Return `application/rss+xml; charset=utf-8`.

Add a compatibility route at `src/routes/rss/+server.ts` that redirects to `/rss.xml`. This makes `/rss.xml` the canonical self URL while preserving the old `/rss` entry point.

Update `src/lib/components/sections/Footer.svelte` so the RSS item has `href="/rss.xml"` and is no longer marked as planned.

## Feed Format

Use RSS 2.0 with Atom and content namespaces:

- `xmlns:atom="http://www.w3.org/2005/Atom"`
- `xmlns:content="http://purl.org/rss/1.0/modules/content/"`

Channel metadata:

- `title`: `David Hellmann - Digital Designer & Developer`
- `link`: `https://davidhellmann.com/`
- `atom:link`: `https://davidhellmann.com/rss.xml`, `rel="self"`, `type="application/rss+xml"`
- `description`: `David is a self-taught Digital Designer & Developer with over fifteen years work experience. Currently he is working @fredmansky`
- `language`: `en-us`
- `pubDate`: newest post date if available, otherwise current build date
- `lastBuildDate`: current build date

Each item should include:

- `title`
- `link`
- `guid` with the absolute post URL
- `pubDate` when a valid date exists
- `author`, falling back to `David Hellmann`
- `description` as CDATA HTML, using `description` first and `descriptionPlain` as fallback
- `content:encoded` as CDATA HTML for serialized full content

## Content Serialization

Serialize the existing `contentBuilder` block types into simple, feed-reader-friendly HTML:

- `block_text_Entry`: emit `richText` HTML as-is inside CDATA.
- `block_image_Entry`: emit a `figure` with an `img` using absolute `src`, `alt`, `width`, and `height` when available.
- `block_images_Entry`: emit one `figure` per image.
- `block_quote_Entry`: emit `blockquote` and optional source/citation link.
- `block_code_Entry`: emit optional heading/description and a `pre > code` block with escaped code.
- `block_cta_Entry`: emit optional heading, description, and links.

Unknown or incomplete blocks should be skipped rather than breaking the feed. Relative links or image URLs should be converted to absolute URLs against `https://davidhellmann.com`.

## Error Handling

The feed should remain valid XML even when entries have incomplete data:

- Missing titles fall back to `Untitled`.
- Missing URLs are built from `uri` or `/blog/{slug}` where possible.
- Invalid dates are omitted on item level.
- Missing authors fall back to `David Hellmann`.
- Empty content-builder arrays simply produce no `content:encoded` body beyond the summary.
- XML text nodes are escaped.
- CDATA wrappers protect against embedded `]]>` sequences.

If there are no blog entries, the route still returns a valid channel with no items.

## Testing

Add focused Vitest coverage for the RSS module:

- XML escaping.
- CDATA wrapping with embedded `]]>`.
- Absolute URL conversion.
- RSS date formatting.
- Blog item rendering with summary and full content.
- Serialization of representative text, image, quote, code, and CTA blocks.

Run project verification with:

- `npm run test`
- `npm run check`

If CMS environment variables are available, also run `npm run build` to confirm static prerendering emits the RSS route.

## Acceptance Criteria

- `/rss.xml` returns valid RSS 2.0 XML with all blog posts.
- `/rss` continues to work and points readers to the canonical feed.
- Footer RSS link is active and points at the new feed.
- Feed item links and media URLs are absolute.
- Feed includes full post content where the current CMS fragments provide enough data.
- Unit tests cover the feed rendering helpers.
- TypeScript/Svelte checks pass.
