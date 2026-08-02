Title: Specify the Node release and environment contract
Type: grilling
Status: resolved
Blocked by:

## Question

What exactly must constitute a runnable, immutable `adapter-node` release, and which configuration belongs to build time, shared release state, or Node runtime?

Specify the release directory contents, production dependency strategy, shared `.env` linkage, Node/pnpm versions, ownership and permissions, build-time `GQL_*` handling, runtime `HOST`/`PORT`/`ORIGIN` handling, and secrets separation between staging and production. Preserve the existing custom releases plus `current` symlink model.

## Answer

The existing custom `releases/<timestamp>` plus atomic `current`-symlink model remains the deployment boundary. A release is an immutable application checkout containing everything needed to start the built Node application; environment-specific configuration remains shared state outside the release.

### Release construction and contents

- Clone the selected commit directly into its final `releases/<timestamp>` directory. Do not build in the existing disposable `cache/` directory and copy only the contents of `build/`.
- In the inactive release, run `pnpm install --frozen-lockfile`, then `pnpm build`, then `pnpm prune --prod`.
- A runnable release therefore retains the source checkout, `build/`, `package.json`, `pnpm-lock.yaml`, and the pruned production `node_modules/`. The Node process starts the `build` directory from this release.
- Do not mutate a release after it has been activated. A dependency, source, generated-output, or toolchain change creates a new release.
- Switch `current` only after install, build, prune, configuration validation, and the later lifecycle checks have succeeded. Activation, health checking, restart ordering, retention, and rollback belong to [Design activation, healthcheck, and rollback](04-design-deployment-lifecycle.md).

### Pinned toolchain

- Pin Node `22.22.3` in `.node-version`.
- Pin pnpm `10.28.2` in the `packageManager` field of `package.json`.
- The deploy verifies both exact versions before installing dependencies and fails before modifying `current` when either differs. Staging and production use the same pinned versions; upgrades are explicit repository changes.

### Build-time versus runtime configuration

- The production build has no environment-specific Craft dependency. It uses the checked-out source, lockfile, pinned toolchain, and Vite/SvelteKit production mode; it does not require `GQL_API_URL` or `GQL_API_TOKEN`.
- Change the GraphQL client from `$env/static/private` to `$env/dynamic/private`. `GQL_API_URL` and `GQL_API_TOKEN` are private Node-runtime configuration and are no longer embedded into the server bundle. Changing either requires a process restart, not a rebuild.
- The checked-in GraphQL types remain the build input. `pnpm build` does not run GraphQL code generation.
- Runtime values are loaded with `node --env-file=.env build`.
- `HOST=127.0.0.1` in every environment. `PORT` is unique per Forge site, and `ORIGIN` is the exact public HTTPS origin of that site. The concrete staging port and origin belong to [Specify the Forge staging topology](03-specify-staging-topology.md).
- The deploy validates the shared environment file and all required runtime variables before activation. A missing file, missing variable, malformed origin, or unavailable/invalid port prevents activation; the later healthcheck also treats runtime misconfiguration as a failed release.

### Shared environment and secret boundary

- Each Forge site owns its own `shared/.env`. A release receives an `.env` symlink to that site's shared file after the secret-independent build and before validation or activation; the file is never copied into the release.
- Staging and production have separate Forge sites, directories, processes, ports, origins, and `.env` files.
- There is intentionally no separate staged CMS. Both environments use the same production Craft GraphQL endpoint and the same read-only GraphQL token; the duplicate values live in their respective `.env` files. This shared read-only upstream is the explicit exception to environment isolation.
- No private environment file or secret is committed to the repository or retained as release content.

### Ownership and permissions

- Deployment and the Node process run as `forge`; the site root, `releases/`, `current`, and `shared/` are owned by `forge:forge`.
- Release directories use normal traversable permissions (`0755`), ordinary release files use `0644`, and only files that truly need execution are executable. `shared/.env` uses `0600`.
- The deployment does not normalize the tree with broad recursive `chown` or `chmod`. It verifies the expected owner and required access and fails visibly when the Forge directory setup is wrong.

The current `deploy.sh` already fits the ownership model when Forge invokes it as `forge`, but its cache build, build-only copy, copied `.env`, unpinned toolchain, and missing production prune must be replaced during implementation.
