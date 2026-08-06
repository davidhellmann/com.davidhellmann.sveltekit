Title: Specify the request-time Craft data-access contract
Type: grilling
Status: resolved
Blocked by: 01

## Question

How should each SSR route query Craft after the unbounded process-local cache is removed?

Specify which routes can use direct entry-by-slug or paginated GraphQL queries, which aggregated routes genuinely require complete collections, and how Home's random Work/Photo selections should behave. Avoid replacing the removed cache with full-collection fetches on every request by accident. Craft's GraphQL cache is the initial cache boundary; do not implement a new Node cache in this decision.

## Answer

Replace the process-local collection caches with purpose-specific request-time GraphQL operations. Each route asks Craft only for the entries and fields required to render that response. Craft's existing GraphQL layer is the initial cache boundary; SvelteKit adds no process cache, TTL cache, stale snapshot, or full-collection memoization.

### Query shapes

Create distinct fragments/operations for three payload classes rather than reusing each full detail fragment everywhere:

- **Detail** fragments contain the complete fields needed by an HTML or Markdown detail route.
- **Card/list** fragments contain only the entry identity, URL, dates, taxonomy labels, images, and metadata actually rendered by the corresponding card/list UI.
- **Index** fragments contain only slug, title/custom title, description text, and other fields required to construct RSS/LLM indexes.

Blog and photo archive queries accept `limit` and `offset` and return both the current window and `entryCount`. Category/topic variants apply their relation filter in the same paginated Craft query. Detail operations accept exactly one slug and `limit: 1`. Independent page-metadata and content queries run in parallel within a request.

For photo archive cards, do not fetch every gallery asset with its full transforms. Fetch lightweight image fields needed for image count/EXIF display plus the four preview images with their card transforms. Home photo cards need only their primary image.

### Route contract

| Route family | Request-time Craft access |
| --- | --- |
| `/` | Fetch the Home entry, latest three Blog cards, latest four Work cards, and latest 20 Photo cards in parallel. Shuffle only that bounded 20-photo result in request scope and return four. Blog and Work are deterministic newest-first. |
| `/[uri]`, `/about` | Fetch the single page entry directly by URI/type. No module-level singleton cache. |
| `/blog[/page]` | Fetch only 24 Blog cards at the page offset plus `entryCount`; fetch Blog-list page metadata in parallel. |
| `/photos[/page]` | Fetch only 24 Photo list items at the page offset plus `entryCount`; fetch Photos-list page metadata in parallel. |
| `/blog/c/[slug][/page]` | Keep the current direct category lookup and relation-filtered Blog query, limited to 48 at the page offset plus `entryCount`; remove prerender enumeration. |
| `/blog/t/[slug][/page]` | Keep the current direct topic lookup and relation-filtered Blog query, limited to 48 at the page offset plus `entryCount`; remove prerender enumeration. |
| `/work` | Fetch the Work-list page metadata and the complete Work collection in parallel, but use only the lightweight Work-card fragment. This is a genuine complete aggregation because the UI displays the whole portfolio. |
| `/blog/[slug]`, `/photos/[slug]`, `/work/[slug]` | Fetch exactly one complete detail entry by slug. Do not load its collection first. |
| `/blog/[slug].md`, `/work/[slug].md`, `/about.md` | Reuse the corresponding direct detail/singleton operation; do not load an index or collection first. |
| `/rss.xml` and `/rss` | Fetch the newest 20 Blog entries with the full fields required to render complete RSS article content. Do not render the entire historical archive. |
| `/llms.txt` | Fetch the newest 12 Blog index entries plus all lightweight Work index entries in parallel. |
| `/llms-full.txt` | Fetch complete Blog and Work indexes, but only through lightweight index fragments. This endpoint is intentionally a genuine complete aggregation. |

The `/work` and `/llms-full.txt` complete reads and the bounded RSS read are deliberate endpoint semantics, not reusable collection helpers. They must not reintroduce a generic “get all entries” abstraction that ordinary pages can call accidentally.

### Home selection semantics

- Blog shows the newest three entries.
- Work shows the newest four entries.
- Photos queries the newest 20 lightweight Home-photo cards and randomly selects four inside that request.
- The photo pool is bounded, so randomness does not require a full Photos collection or defeat Craft caching with a database-level random ordering query.
- Do not shuffle Work a second time in `GridBentoWork`; the server result defines both selection and order.

### Removal and failure behavior

- Delete `src/lib/data/entries-cache.ts`, its tests, and the Blog/Photos/Work wrappers built around it once all callers use purpose-specific GraphQL operations.
- Remove the module-level `cached` value from `src/lib/data/about.ts`; About is a direct singleton query like the other page entries.
- Remove cache-only `VITE_BATCH_SIZE` and `VITE_CONCURRENCY` behavior. Pagination limits remain explicit route/query constants.
- Remove every content `entries()` generator together with the full runtime-rendering migration already decided in [Specify the prerender and SSR boundary](01-specify-rendering-boundary.md).
- A missing detail entry returns an actual `404`; it does not return an empty successful page.
- Existing canonical first-page and out-of-range archive redirects remain.
- A Craft transport or GraphQL error propagates as a visible server failure. Do not silently return an empty result or stale process data. Any future stale-on-error behavior belongs exclusively to the explicit Nginx cache decision.

## Amendment — 2026-08-04

During implementation, the user deliberately replaced the payload-shaping part of this answer with a simpler query contract:

- Reuse the existing `GetBlogEntries`, `GetPhotosEntries`, and `GetWorkEntries` operations and their existing entry fragments for Home, archives, detail routes, RSS, and LLM endpoints.
- Add only the variables needed for request-time access (`slug`, existing `limit`, existing `offset`, and `fullContent`); do not add separate Card/List/Index operations or fragments.
- Use `fullContent: false` for Home, archives, and LLM indexes to omit heavy SEO, author, adjacent-entry, content-builder, and detail-only fields. Use `fullContent: true` for HTML/Markdown detail routes and RSS. Photo archive image fields remain available in both modes because that UI needs image count, EXIF, and previews.
- The route limits, offsets, parallel loading, Home selection behavior, direct detail lookups, real 404s, removal of the process cache, and visible Craft failures remain unchanged.
- Some larger Craft responses and HTML serialization cost remain explicitly accepted in exchange for fewer GraphQL documents and less query-maintenance code. Staging validation must measure the resulting cold and warm behavior before production cutover.

This amendment supersedes the earlier “Query shapes” section and every lightweight-fragment requirement in the route table. It does not restore the removed process-local cache or full-collection fetches for paginated routes.
