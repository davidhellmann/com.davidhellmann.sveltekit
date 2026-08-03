Title: Design activation, healthcheck, and rollback
Type: grilling
Status: resolved
Blocked by: 02, 03

## Question

What is the complete failure-safe lifecycle for building, activating, verifying, restarting, retaining, and rolling back a Node release within the existing custom deploy script?

Specify ordering and failure behavior for dependency installation, build, release creation, shared-file linkage, symlink activation, Supervisor restart, readiness/health checking, automatic or manual rollback, cleanup of old releases, and deploys that exceed Forge's time limit. The answer should identify the last known-good release throughout the sequence.

## Answer

Use a two-part deployment: a deliberately small site-specific bootstrap remains in Forge, while the versioned repository `deploy.sh` owns the lifecycle after the target code has been cloned. At every point, `current` is the active, health-checked release and `previous` is its last health-checked predecessor.

### Forge bootstrap boundary

- Forge serializes deployments for a site, so no additional application-level deploy lock is required. Operators must not invoke the same site's deploy manually in parallel. Staging and production remain independent and may deploy concurrently.
- The Forge deploy field contains only stable bootstrap behavior: enable strict shell failure handling, define the site's `APP_PORT` and exact `SUPERVISOR_PROCESS`, create a timestamped path below `$FORGE_SITE_ROOT/releases`, clone `$FORGE_SITE_BRANCH` directly into that path, and invoke that new checkout's `deploy.sh`.
- Use Forge's injected `$FORGE_SITE_ROOT` and `$FORGE_SITE_BRANCH` rather than duplicating the site root or branch in repository code. Keep “Make `.env` variables available to deployment script” disabled; deployment does not require the GraphQL secrets.
- If cloning fails, the bootstrap removes the partial directory and exits non-zero. No active state has changed.
- All future lifecycle logic changes belong in repository `deploy.sh`. Calling `current/deploy.sh` for a normal deployment is explicitly avoided because that would execute the previously active script version rather than the version belonging to the candidate code.

### Candidate preparation

The bootstrap-created checkout is the **candidate release**. `deploy.sh` performs the following operations while `current` and the running daemon remain untouched:

1. Enable strict error handling and verify that the candidate is a new directory immediately below this site's `releases/` path.
2. Record the deployment start time, the candidate release name, commit SHA, and the existing absolute `current` target. The existing target is the in-process **last known good**.
3. Verify the exact pinned Node and pnpm versions, required ownership and permissions, and existence of `shared/.env`.
4. Run `pnpm install --frozen-lockfile`.
5. Run `pnpm build`.
6. Run `pnpm prune --prod`. This removes packages declared in `devDependencies` from the installed tree after they have completed their build role, while retaining runtime dependencies. See [pnpm prune](https://pnpm.io/cli/prune).
7. Verify the runnable release contract: expected Node build entrypoint, `package.json`, `pnpm-lock.yaml`, production `node_modules/`, commit metadata, and no copied private environment file.
8. Link the candidate `.env` to this site's `shared/.env`, then validate every required runtime value and its environment-specific origin/port contract.
9. Check that the currently active homepage is healthy before disrupting it. If the existing application or shared Craft upstream is already failing, abort instead of attributing that failure to the candidate.

Any failure in these steps exits non-zero, removes the incomplete candidate, and leaves `current`, `previous`, and Supervisor untouched.

### Forge time-limit safety gate

Forge's hard deployment limit remains ten minutes. Seven minutes is the maximum elapsed preparation time before activation, not the intended total deployment duration.

Immediately before the first active-state mutation, `deploy.sh` checks elapsed time. At seven minutes or later it aborts, removes the inactive candidate, and leaves the active process unchanged. The remaining three minutes are reserved for atomic activation, Supervisor restart, verification, and a possible rollback, preventing Forge from terminating the script after `current` has changed but before recovery can complete.

### Atomic activation and verification

1. Resolve and retain the old `current` target in memory. Create a temporary symlink alongside `current`, then atomically rename it over `current`; do not use a remove-then-create symlink sequence.
2. Restart only the exact Supervisor process supplied by this Forge site's bootstrap. A symlink switch without this restart is not a successful activation.
3. Poll a normal SSR homepage directly through the site's local Node port for at most 60 seconds, using the appropriate host/origin headers and short per-request connection/request timeouts.
4. The first HTTP `200` HTML response is sufficient. No dedicated `/healthz` route is added: the real page proves that the new Node process starts, SvelteKit renders, and the shared read-only Craft upstream can be queried.
5. After the candidate succeeds, atomically point `previous` at the old last-known-good release. `current` is now the new known-good release and the deployment may proceed to retention cleanup.

The brief single-process restart window accepted by the map remains. This lifecycle does not claim zero downtime.

### Automatic failure rollback

If Supervisor restart or the candidate homepage check fails after `current` changed:

1. Atomically restore `current` to the captured last-known-good path.
2. Restart the same Supervisor process again.
3. Poll the restored homepage with the same 60-second policy.
4. Exit the Forge deploy non-zero even when recovery succeeds, so the attempted deployment is visibly failed.
5. Retain the rejected complete release with a failure marker for diagnosis; it is never pointed to by `current` or `previous` automatically.

If the restored release also fails, leave `current` pointing at that pre-deploy last-known-good path, report a high-signal rollback failure, and require operator intervention. This commonly indicates a shared upstream or host failure that changing application releases cannot repair.

On the first-ever staging activation there may be no prior `current`. If that candidate fails, stop its daemon, remove the failed `current` link, retain the marked candidate for diagnosis, and exit non-zero; automatic rollback is impossible because no known-good Node release exists yet. The special production migration from the former static runtime is governed later by [Decide the production cutover and rollback runbook](08-decide-production-cutover.md).

### Manual rollback

Repository `deploy.sh` also supports:

```sh
deploy.sh --rollback [release-name]
```

- Invoke it through Forge Commands or SSH with the same site-specific `APP_PORT` and exact `SUPERVISOR_PROCESS` used by the Forge bootstrap.
- With no release name, it targets `previous`; an explicit name may select another complete release under this site's own `releases/` directory.
- It performs no clone, dependency install, or build. It refuses missing, incomplete, outside-root, or already active targets.
- It captures the currently active release, switches atomically, restarts, and applies the same 60-second homepage verification. If the requested target fails, it restores and rechecks the originally active release.
- The final production cutover ticket must provide the operator with exact copy-paste commands and a safe method for selecting a release.

### Retention and cleanup

- Retain at most five complete release directories per site because every release includes production `node_modules/`.
- Incomplete pre-activation candidates are deleted immediately.
- A complete release rejected after activation remains marked for diagnosis and counts toward the limit.
- Cleanup runs only after either a new activation or a rollback has been successfully verified. It never runs while recovery is unresolved.
- Both `current` and `previous` targets are always protected. Remove only the oldest other inactive releases until no more than five complete releases remain.
