Title: Specify the prerender and SSR boundary
Type: grilling
Status: resolved
Blocked by:

## Question

What is the exact route-by-route rendering contract after the migration?

Turn the standing preference—fixed top-level pages plus the first two pages of every paginated archive are prerendered, later archive pages and all detail pages are SSR—into an exhaustive route matrix. Resolve taxonomy archives, optional page parameters and canonical page-one redirects, generic CMS pages, Markdown endpoints, feeds, `llms` files, and static file responses. Define the required `prerender`, `entries`, and crawl behavior without implementing it.

## Answer

Use full runtime rendering through `adapter-node`. Code deployments and CMS publishing are separate lifecycles: publishing or changing Craft content must not require a SvelteKit deployment.

### Route contract

| Route family | Runtime contract |
| --- | --- |
| `/` | SSR; fetch the Home single at request time. |
| `/about` | SSR; fetch the About single at request time. |
| `/[uri]` | SSR for every published entry in Crafts `pages` section. No build-time enumeration. |
| `/blog`, `/blog/<page>` | SSR for every archive page. `/blog/1` remains a runtime `301` to `/blog`; out-of-range behavior remains a runtime redirect. |
| `/photos`, `/photos/<page>` | SSR for every archive page. `/photos/1` remains a runtime `301` to `/photos`; out-of-range behavior remains a runtime redirect. |
| `/blog/c/<slug>[/<page>]` | SSR for every category and page. The `/1` alias and out-of-range behavior remain runtime redirects. |
| `/blog/t/<slug>[/<page>]` | SSR for every topic and page. The `/1` alias and out-of-range behavior remain runtime redirects. |
| `/blog/<slug>`, `/work/<slug>`, `/photos/<slug>` | SSR for all detail pages. Missing or unpublished content must produce the application's runtime not-found behavior. |
| `/about.md`, `/blog/<slug>.md`, `/work/<slug>.md` | Render Markdown on demand through SSR. |
| `/rss.xml`, `/llms.txt`, `/llms-full.txt` | Generate from current Craft content at request time. |
| `/rss` | Keep the redirect behavior, but handle it at runtime too; its cost does not justify a separate rendering mode. |
| `/[filename]` SEOmatic/front-end templates, sitemap files and styles | Resolve and serve from current Craft data at request time. |

Static files in SvelteKits `static/` directory and generated client assets are still served as static assets by `adapter-node`; "full SSR" refers to application routes, not asset delivery.

### SvelteKit configuration contract

- Remove every route-level `export const prerender = true` for the application routes above, or replace it explicitly with `false` only where clarity warrants it. SvelteKits default is runtime rendering.
- Remove every content `entries()` generator. Runtime routes no longer need Craft content enumerated during the build.
- Remove the custom `kit.prerender.crawl: false` configuration because there is no application-route prerender set to control.
- Remove the `adapter-static` fallback configuration; `adapter-node` handles runtime routes and 404 responses.
- Do not use `prerender = "auto"`; there is intentionally no build-generated content subset.

### Cache boundary

- Remove the existing unbounded process-local cache in `src/lib/data/entries-cache.ts`; it would otherwise make SSR content stale until a process restart.
- Initially use Crafts GraphQL cache as the only data-cache layer.
- SvelteKit can emit response cache headers but `adapter-node` has no built-in persistent TTL cache or ISR. Experimental remote-function query caching is request-scoped on the server and does not provide this behavior. See [Loading data: Headers](https://svelte.dev/docs/kit/load#Headers), [Node servers](https://svelte.dev/docs/kit/adapter-node), and [Remote functions: Deduplication](https://svelte.dev/docs/kit/remote-functions#query-Deduplication).
- Any later whole-response TTL, background refresh, or stale-on-error behavior belongs in Nginx and does not alter this SSR route contract.

### Accepted trade-off

All CMS-backed routes depend on Craft at request time. The user accepts initial request failure when Craft is unavailable; stale response serving may be added later through Nginx if staging justifies it.
