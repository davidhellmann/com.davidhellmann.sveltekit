Title: Specify the Forge staging topology
Type: grilling
Status: resolved
Blocked by:

## Question

How should the required Forge staging site be isolated while remaining production-like enough to validate the migration?

Decide its subdomain, filesystem roots, port, Supervisor process, Nginx site, environment/secrets, Craft endpoint and permissions, indexing/access protection, deployment branch, and how closely its infrastructure must mirror production. The result must make accidental public indexing, writes, or production-process interference unlikely.

## Answer

Create `https://stage.davidhellmann.com` as an independent Forge site on the same server as production. It is an optional integration environment for changes that warrant Forge/runtime validation, not a mandatory promotion lane for every feature.

### Site and filesystem boundary

- Production is already live at `https://davidhellmann.com` with its actual site root at `/home/forge/davidhellmann.com`. The repository's current `deploy.sh` still contains the obsolete transition-site values and must be reconciled with the real Forge configuration during implementation.
- Staging uses `/home/forge/stage.davidhellmann.com`, with its own `releases/`, `current`, and `shared/` paths. It does not share release directories, symlinks, or writable files with production.
- Both trees are owned and deployed by `forge:forge` under the release and permission contract from [Specify the Node release and environment contract](02-specify-release-and-environment-contract.md).
- DNS for `stage.davidhellmann.com` points to the existing server. The staging Forge site receives its own HTTPS certificate.

### Node, Supervisor, and Nginx isolation

- Production listens only on `127.0.0.1:3000`; staging listens only on `127.0.0.1:3001`.
- Staging has a dedicated Forge Supervisor daemon whose working directory is `/home/forge/stage.davidhellmann.com/current`. Production's daemon uses `/home/forge/davidhellmann.com/current`.
- Staging has its own Nginx virtual host proxying only to port `3001`; production proxies only to port `3000`.
- A staging deploy or restart may address only the staging release tree and staging daemon. It must not use a wildcard, shared daemon identifier, shared port, or Nginx operation that can restart or reconfigure production.
- Exact Supervisor settings, proxy headers, configuration tests, restart behavior, and healthcheck access belong to [Specify the Supervisor and Nginx runtime contract](05-specify-runtime-and-proxy-contract.md) and [Design activation, healthcheck, and rollback](04-design-deployment-lifecycle.md).

### Branch and deployment role

- `main` remains the production branch. `stage` is a long-lived, optional integration branch tracked by the staging Forge site with Quick Deploy enabled.
- A merge or push to `stage` automatically builds and deploys only staging. A failed staging deployment leaves its previous release active and cannot affect production.
- Low-risk features may continue to go directly to `main` without visiting staging.
- A change requiring staging validation is proposed from its feature branch to `stage`, tested there, and then proposed from that same feature branch separately to `main`. The whole `stage` branch is not promoted to production, because it may contain other work.
- `main` is merged back into `stage` regularly so the optional integration environment does not drift indefinitely from production. Consequently, staging validates the relevant change on production-like infrastructure but does not promise a byte-identical future production commit.

### Environment and Craft access

- Staging has its own `/home/forge/stage.davidhellmann.com/shared/.env`, symlinked into each staging release according to the release contract.
- Its environment-specific values include `NODE_ENV=production`, `HOST=127.0.0.1`, `PORT=3001`, and `ORIGIN=https://stage.davidhellmann.com`. Production uses its own file with port `3000` and origin `https://davidhellmann.com`.
- There is no staged Craft installation. Staging intentionally uses the same production `GQL_API_URL` and the same read-only `GQL_API_TOKEN` as production. Because the application only queries through this token, staging has no CMS write capability.
- Other secrets and Forge resources remain environment-specific. The shared read-only Craft upstream is the only intentional cross-environment dependency.

### Access and indexing protection

- Require Nginx Basic Auth for all external staging requests. Store the password file on the server outside the repository, release tree, and application `.env`, with permissions that allow only Nginx administration/runtime access.
- Add `X-Robots-Tag: noindex, nofollow, noarchive` with `always` semantics to staging responses.
- Because the application receives its normal robots content from the shared production Craft environment, override `/robots.txt` only in the staging Nginx virtual host and return `User-agent: *` plus `Disallow: /`. Do not change Craft or application behavior for this.
- The later healthcheck may use loopback or explicit credentials, but no public unauthenticated exception is introduced merely for monitoring.

### Production-parity rule

Staging mirrors production's pinned Node and pnpm versions, immutable-release layout, deploy script, application build, Supervisor parameters, and Nginx reverse-proxy behavior. The permitted differences are limited to domain/origin, site root, port, deployment branch and trigger, environment file, and the staging-only access/indexing controls above.
