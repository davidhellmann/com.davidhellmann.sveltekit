## Destination

Create an implementation-ready specification for migrating this site from `adapter-static` to an `adapter-node` deployment on Laravel Forge, covering the render boundary, caching, release/deployment lifecycle, runtime operation, rollback, staging validation, and production cutover.

The map is complete when implementation can begin without further architectural or operational decisions and the resulting deployment is expected to remain reliably below Forge's 10-minute deployment limit.

## Notes

- Domain: SvelteKit SSR through `adapter-node` and operation of the Node server on the existing Laravel Forge host.
- Start every session with [SvelteKit `adapter-node` auf Laravel Forge](../../docs/research/sveltekit-node-forge.md); it contains the local-system findings and primary-source research that established the feasible options.
- Use `/grilling` and `/domain-modeling` for human decisions. Keep planning separate from implementation.
- Preserve the existing custom release-directory and atomic `current`-symlink deployment model; adapt it for Node rather than replacing it with Forge's deployment model.
- Rendering decision confirmed by the user: all routes are handled at runtime by `adapter-node`; code deployments must not be required to publish CMS content. Static assets remain static.
- Cache preference confirmed by the user: remove the existing unbounded Node in-memory data cache and initially rely on Craft's warm GraphQL layer. SvelteKit has no persistent adapter-node ISR/page cache; consider Nginx response caching after staging for performance, controlled freshness, or stale-on-error resilience.
- A dedicated Forge staging site with its own subdomain, paths, port, Supervisor process, Nginx configuration, and environment is required before production cutover.
- A brief restart window is acceptable; do not introduce blue/green processes or socket activation unless validation proves the simpler model inadequate.
- Production cutover requires: deploy below 10 minutes; correct SSR behavior and CMS freshness; correct direct requests, assets, redirects, canonicals, and 404s; and tested healthcheck plus rollback.
- Use ticket names in discussion; local tracker paths are the links.

## Decisions so far

<!-- Decisions are added here only when their tickets are resolved. -->

- [Specify the prerender and SSR boundary](issues/01-specify-rendering-boundary.md) — Use full runtime rendering for every route, remove all content `entries()` generators and the prerender crawler configuration, and let code deploys remain independent of CMS publishing.
- [Specify the Node release and environment contract](issues/02-specify-release-and-environment-contract.md) — Build each immutable release in place with pinned Node and pnpm, pruned production dependencies, and a validated per-site runtime `.env`; staging and production deliberately share only the read-only Craft upstream credentials.
- [Specify the Forge staging topology](issues/03-specify-staging-topology.md) — Run `stage.davidhellmann.com` as an independently protected Forge site on port 3001 with its own release tree, daemon, proxy, environment, and optional `stage`-branch workflow while mirroring production everywhere else.
- [Design activation, healthcheck, and rollback](issues/04-design-deployment-lifecycle.md) — Prepare releases without touching the active process, activate atomically only before a seven-minute safety gate, verify a real SSR page, and automatically restore the persistent last-known-good predecessor on failure.

## Not yet specified

- The exact implementation sequence and commit breakdown should be derived only after the rendering, runtime, deployment, validation, and cutover contracts are resolved.
- Longer-term observability and alerting may become specifiable after staging exposes the runtime's actual failure modes; only cutover-critical health checking belongs to this effort now.

## Out of scope

- Implementing the migration while charting this map.
- Replacing Laravel Forge or introducing an external cache/CDN/service.
- Guaranteed zero-downtime deployment unless staging demonstrates that the accepted short restart window is operationally unsafe.
- Broad application refactors unrelated to the adapter migration and the routes affected by the render boundary.
