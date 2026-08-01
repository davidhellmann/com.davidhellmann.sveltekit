## Destination

Create an implementation-ready specification for migrating this site from `adapter-static` to a mixed `adapter-node` deployment on Laravel Forge, covering the render boundary, caching, release/deployment lifecycle, runtime operation, rollback, staging validation, and production cutover.

The map is complete when implementation can begin without further architectural or operational decisions and the resulting deployment is expected to remain reliably below Forge's 10-minute deployment limit.

## Notes

- Domain: SvelteKit mixed prerendering/SSR and operation of the Node server on the existing Laravel Forge host.
- Start every session with [SvelteKit `adapter-node` auf Laravel Forge](../../docs/research/sveltekit-node-forge.md); it contains the local-system findings and primary-source research that established the feasible options.
- Use `/grilling` and `/domain-modeling` for human decisions. Keep planning separate from implementation.
- Preserve the existing custom release-directory and atomic `current`-symlink deployment model; adapt it for Node rather than replacing it with Forge's deployment model.
- Rendering preference confirmed by the user: prerender fixed top-level entry pages and the first two pages of paginated archives; render later archive pages and all content detail pages through SSR.
- Cache preference confirmed by the user: initially rely on Craft's warm GraphQL layer and add no Node, Nginx, CDN, or HTML cache. Consider an Nginx microcache only if staging/production-like measurement shows p95 TTFB above 500 ms or problematic CMS load.
- A dedicated Forge staging site with its own subdomain, paths, port, Supervisor process, Nginx configuration, and environment is required before production cutover.
- A brief restart window is acceptable; do not introduce blue/green processes or socket activation unless validation proves the simpler model inadequate.
- Production cutover requires: deploy below 10 minutes; correct prerender/SSR boundary; correct CMS freshness; correct direct requests, assets, redirects, canonicals, and 404s; and tested healthcheck plus rollback.
- Use ticket names in discussion; local tracker paths are the links.

## Decisions so far

<!-- Decisions are added here only when their tickets are resolved. -->

## Not yet specified

- The exact implementation sequence and commit breakdown should be derived only after the rendering, runtime, deployment, validation, and cutover contracts are resolved.
- Longer-term observability and alerting may become specifiable after staging exposes the runtime's actual failure modes; only cutover-critical health checking belongs to this effort now.

## Out of scope

- Implementing the migration while charting this map.
- Replacing Laravel Forge or introducing an external cache/CDN/service.
- Guaranteed zero-downtime deployment unless staging demonstrates that the accepted short restart window is operationally unsafe.
- Broad application refactors unrelated to the adapter migration and the routes affected by the render boundary.
