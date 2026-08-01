Title: Specify the Node release and environment contract
Type: grilling
Status: open
Blocked by:

## Question

What exactly must constitute a runnable, immutable `adapter-node` release, and which configuration belongs to build time, shared release state, or Node runtime?

Specify the release directory contents, production dependency strategy, shared `.env` linkage, Node/pnpm versions, ownership and permissions, build-time `GQL_*` handling, runtime `HOST`/`PORT`/`ORIGIN` handling, and secrets separation between staging and production. Preserve the existing custom releases plus `current` symlink model.
