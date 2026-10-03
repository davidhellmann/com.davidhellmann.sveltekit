# Agent guidance

## Working agreements

- Keep changes focused; share a short plan before non-trivial work.
- Preserve unrelated working-tree changes. Ask before destructive operations; do not push or deploy without approval.
- Never inspect or expose secrets, credential files, or `.env` contents.
- Use the user's active skills (currently AI Hero). Do not impose another workflow or add repo-local skills or agents unless requested.
- Report what changed, what was verified, and what remains unverified.

## Commands

Use pnpm; `package.json` pins the package-manager version and supported Node version.

- `pnpm dev` — SvelteKit sync, GraphQL codegen watcher, and Vite dev server at `http://davidhellmann.sveltekit.test:5173`.
- `pnpm check` — Svelte and TypeScript checks.
- `pnpm test --run` — run Vitest once (plain `pnpm test` watches).
- `pnpm build` — production Node-server build in `build/`.
- `pnpm preview` — preview the production build locally.
- `pnpm lint` — repository-wide Prettier and ESLint checks.
- `pnpm codegen` — regenerate GraphQL types and SDK; requires configured CMS access.
- `pnpm icons:add` — add icons via Sly.

Run checks appropriate to the change. For application changes, run typecheck and tests; also build when changing imports, assets, routing, or build configuration. Avoid repository-wide formatting for a focused change.

## Current architecture

- SvelteKit 3, Svelte 5, TypeScript, Tailwind CSS 4; CMS-backed portfolio, blog, and photography site.
- `vite.config.ts` contains SvelteKit configuration, the Node adapter, Tailwind, SVG sprite generation, and Vitest configuration. There is no separate `svelte.config.js`.
- `src/params.ts` defines route parameters with `defineParams`.
- `src/routes/` contains pages and server loads, plus RSS and Markdown/text endpoints.
- `src/lib/graphql/cms-content.ts` provides CMS data access; `graphql-client.ts` configures the client. Keep private CMS access server-side.
- GraphQL operations and fragments live in `src/lib/graphql/queries/`. `src/lib/graphql/graphql.ts` is generated: change source operations and regenerate rather than editing it manually.
- `src/lib/components/` is grouped by purpose: `builders`, `cards`, `stacks`, `heros`, `containers`, `sections`, `modals`, and shared primitives.
- `builders/ContentBuilder.svelte` and `builders/content-blocks.ts` handle general CMS content blocks; work media and about-page matrices have dedicated components.
- `src/lib/actions/` contains DOM interactions and animations. Keep browser-only work out of server rendering.

## Imports and assets

- Use the existing `#lib/*` package subpath imports, e.g. `#lib/components/text/Headline.svelte` or `#lib/utils/date.js`.
- Include `.js` for TypeScript module imports through `#lib/*`; use `import type` for type-only dependencies.
- Do not reintroduce `$lib`, `$components`, `$graphql`, `$styles`, `$images`, `$utils`, or deprecated SvelteKit `alias` configuration.
- In CSS `url(...)`, use relative paths to local assets so Vite resolves and fingerprints them.
- SVG sprites and `src/lib/types/heroicons-icons.d.ts` are generated; change source icons, not generated output.

## Task-specific documentation

Read only what is relevant to the task:

- UI and styling: [DESIGN.md](DESIGN.md).
- AI Hero issue tracker: issues and PRDs live as local Markdown in `.scratch/<feature-slug>/`; external PRs are not a triage surface. See [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md) for tracker operations.
- AI Hero triage: use the default five-role vocabulary mapped in [docs/agents/triage-labels.md](docs/agents/triage-labels.md).
- AI Hero domain docs: this repo uses a single-context layout. See [docs/agents/domain.md](docs/agents/domain.md) when doing domain-modeling work.
- Deployment: [docs/forge-node-deployment.md](docs/forge-node-deployment.md); verify historical instructions against the current configuration before use.

`.scratch/`, `docs/plans/`, `docs/specs/`, and `docs/research/` contain task history and investigations, not mandatory global workflows. Read the relevant task's material when continuing that work; do not treat old plans as current architecture.
