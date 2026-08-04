#!/usr/bin/env bash

set -Eeuo pipefail

readonly EXPECTED_NODE_VERSION="v22.22.3"
readonly EXPECTED_PNPM_VERSION="10.28.2"
readonly MAX_RELEASES=5
readonly PRE_ACTIVATION_LIMIT_SECONDS=420
readonly HEALTHCHECK_TIMEOUT_SECONDS=60

log() {
  printf '[deploy] %s\n' "$*"
}

fail() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

require_variable() {
  local name="$1"
  [[ -n "${!name:-}" ]] || fail "$name is required"
}

require_variable FORGE_SITE_ROOT
require_variable APP_PORT
require_variable SUPERVISOR_PROCESS

readonly SITE_ROOT="$(realpath "$FORGE_SITE_ROOT")"
readonly RELEASES_PATH="$SITE_ROOT/releases"
readonly SHARED_ENV="$SITE_ROOT/shared/.env"
readonly CURRENT_LINK="$SITE_ROOT/current"
readonly PREVIOUS_LINK="$SITE_ROOT/previous"
readonly EXPECTED_ORIGIN="https://$(basename "$SITE_ROOT")"
readonly DEPLOY_STARTED_AT="${DEPLOY_STARTED_AT:-$(date +%s)}"

atomic_link() {
  local target="$1"
  local link="$2"
  local temporary_link="${link}.tmp.$$"

  ln -s "$target" "$temporary_link"
  mv -Tf "$temporary_link" "$link"
}

restart_process() {
  log "Restarting $SUPERVISOR_PROCESS"
  sudo supervisorctl restart "$SUPERVISOR_PROCESS"
}

stop_process() {
  log "Stopping $SUPERVISOR_PROCESS"
  sudo supervisorctl stop "$SUPERVISOR_PROCESS" || true
}

healthcheck() {
  local timeout_seconds="${1:-$HEALTHCHECK_TIMEOUT_SECONDS}"
  local deadline=$(( $(date +%s) + timeout_seconds ))
  local body_file
  local headers_file
  body_file="$(mktemp)"
  headers_file="$(mktemp)"

  while (( $(date +%s) < deadline )); do
    if curl \
      --silent \
      --show-error \
      --fail \
      --connect-timeout 2 \
      --max-time 10 \
      --header "Host: $(basename "$SITE_ROOT")" \
      --header "X-Forwarded-Proto: https" \
      --dump-header "$headers_file" \
      --output "$body_file" \
      "http://127.0.0.1:$APP_PORT/" \
      && grep -qi '^content-type: text/html' "$headers_file" \
      && [[ -s "$body_file" ]]; then
      rm -f "$body_file" "$headers_file"
      return 0
    fi

    sleep 2
  done

  rm -f "$body_file" "$headers_file"
  return 1
}

validate_environment() {
  [[ -f "$SHARED_ENV" ]] || fail "Missing shared environment: $SHARED_ENV"
  [[ "$(stat -c '%U' "$SHARED_ENV")" == "forge" ]] || fail "$SHARED_ENV must be owned by forge"
  [[ "$(stat -c '%a' "$SHARED_ENV")" == "600" ]] || fail "$SHARED_ENV must have mode 600"

  node --env-file="$SHARED_ENV" -e '
    const expectedPort = process.argv[1];
    const expectedOrigin = process.argv[2];
    const required = ["GQL_API_URL", "GQL_API_TOKEN", "NODE_ENV", "HOST", "PORT", "ORIGIN", "SHUTDOWN_TIMEOUT"];
    const missing = required.filter((name) => !process.env[name]);
    if (missing.length) throw new Error(`Missing runtime variables: ${missing.join(", ")}`);
    if (process.env.NODE_ENV !== "production") throw new Error("NODE_ENV must be production");
    if (process.env.HOST !== "127.0.0.1") throw new Error("HOST must be 127.0.0.1");
    if (process.env.PORT !== expectedPort) throw new Error(`PORT must be ${expectedPort}`);
    if (process.env.ORIGIN !== expectedOrigin) throw new Error(`ORIGIN must be ${expectedOrigin}`);
    if (process.env.SHUTDOWN_TIMEOUT !== "30") throw new Error("SHUTDOWN_TIMEOUT must be 30");
    if (new URL(process.env.GQL_API_URL).protocol !== "https:") throw new Error("GQL_API_URL must use HTTPS");
    if (new URL(process.env.ORIGIN).protocol !== "https:") throw new Error("ORIGIN must use HTTPS");
  ' "$APP_PORT" "$EXPECTED_ORIGIN"
}

validate_toolchain() {
  [[ "$(node --version)" == "$EXPECTED_NODE_VERSION" ]] \
    || fail "Expected Node $EXPECTED_NODE_VERSION, found $(node --version)"
  [[ "$(pnpm --version)" == "$EXPECTED_PNPM_VERSION" ]] \
    || fail "Expected pnpm $EXPECTED_PNPM_VERSION, found $(pnpm --version)"
}

validate_release() {
  local release="$1"

  [[ -f "$release/build/index.js" ]] || fail "Missing build/index.js in $release"
  [[ -f "$release/package.json" ]] || fail "Missing package.json in $release"
  [[ -f "$release/pnpm-lock.yaml" ]] || fail "Missing pnpm-lock.yaml in $release"
  [[ -d "$release/node_modules" ]] || fail "Missing production node_modules in $release"
  [[ -d "$release/.git" ]] || fail "Missing Git metadata in $release"
  [[ "$(stat -c '%U' "$release")" == "forge" ]] || fail "$release must be owned by forge"
}

mark_complete() {
  local release="$1"
  git -C "$release" rev-parse HEAD > "$release/.release-complete"
}

mark_failed() {
  local release="$1"
  printf '%s %s\n' "$(date --iso-8601=seconds)" "${2:-activation failed}" > "$release/.release-failed"
}

cleanup_releases() {
  local current_target=""
  local previous_target=""
  local count

  current_target="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"
  previous_target="$(readlink -f "$PREVIOUS_LINK" 2>/dev/null || true)"
  count="$(find "$RELEASES_PATH" -mindepth 1 -maxdepth 1 -type d | wc -l)"

  while (( count > MAX_RELEASES )); do
    local removed=false
    local release

    while IFS= read -r release; do
      [[ "$release" == "$current_target" || "$release" == "$previous_target" ]] && continue
      log "Removing old release $(basename "$release")"
      rm -rf -- "$release"
      removed=true
      break
    done < <(find "$RELEASES_PATH" -mindepth 1 -maxdepth 1 -type d | sort)

    [[ "$removed" == true ]] || fail "Cannot enforce release retention without removing current or previous"
    count=$((count - 1))
  done
}

rollback_to() {
  local target="$1"
  local original="$2"

  atomic_link "$target" "$CURRENT_LINK"
  if restart_process && healthcheck; then
    [[ -n "$original" ]] && atomic_link "$original" "$PREVIOUS_LINK"
    log "Rollback active: $(basename "$target")"
    cleanup_releases
    return 0
  fi

  log "Requested rollback target failed its healthcheck"
  if [[ -n "$original" ]]; then
    atomic_link "$original" "$CURRENT_LINK"
    restart_process || true
    healthcheck || fail "Rollback target and original release are both unhealthy"
  fi
  return 1
}

manual_rollback() {
  local release_name="${1:-}"
  local target
  local original

  original="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"
  [[ -n "$original" ]] || fail "There is no active release"

  if [[ -n "$release_name" ]]; then
    [[ "$release_name" != */* ]] || fail "Release name must not contain a path"
    target="$(realpath "$RELEASES_PATH/$release_name" 2>/dev/null || true)"
  else
    target="$(readlink -f "$PREVIOUS_LINK" 2>/dev/null || true)"
  fi

  [[ -n "$target" ]] || fail "No rollback target found"
  [[ "$(dirname "$target")" == "$RELEASES_PATH" ]] || fail "Rollback target is outside this site"
  [[ -f "$target/.release-complete" ]] || fail "Rollback target is not a complete Node release"
  [[ "$target" != "$original" ]] || fail "Rollback target is already active"

  rollback_to "$target" "$original" || fail "Manual rollback failed; original release restored"
}

deploy_candidate() {
  local candidate
  local old_target=""
  local activated=false

  candidate="$(realpath "$PWD")"
  [[ "$(dirname "$candidate")" == "$RELEASES_PATH" ]] \
    || fail "deploy.sh must run from a candidate directly below $RELEASES_PATH"
  [[ ! -e "$candidate/.env" ]] || fail "Candidate must not contain a copied .env"

  cleanup_incomplete_candidate() {
    local status=$?
    if (( status != 0 )) && [[ "$activated" == false ]]; then
      log "Removing incomplete candidate $(basename "$candidate")"
      cd "$SITE_ROOT"
      rm -rf -- "$candidate"
    fi
    exit "$status"
  }
  trap cleanup_incomplete_candidate EXIT

  mkdir -p "$RELEASES_PATH" "$SITE_ROOT/shared"
  validate_toolchain
  validate_environment

  log "Installing dependencies"
  pnpm install --frozen-lockfile

  log "Building adapter-node release"
  pnpm build

  log "Pruning development dependencies"
  pnpm prune --prod

  validate_release "$candidate"
  ln -s "$SHARED_ENV" "$candidate/.env"
  [[ "$(readlink -f "$candidate/.env")" == "$SHARED_ENV" ]] || fail "Invalid .env link"
  mark_complete "$candidate"

  local active_target
  active_target="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"
  if [[ -n "$active_target" && -f "$active_target/.release-complete" ]]; then
    log "Checking currently active Node release"
    healthcheck 15 || fail "Current release is unhealthy; candidate was not activated"
    old_target="$active_target"
  fi

  local elapsed=$(( $(date +%s) - DEPLOY_STARTED_AT ))
  (( elapsed < PRE_ACTIVATION_LIMIT_SECONDS )) \
    || fail "Preparation took ${elapsed}s; refusing activation after the seven-minute safety gate"

  log "Activating $(basename "$candidate")"
  atomic_link "$candidate" "$CURRENT_LINK"
  activated=true

  if restart_process && healthcheck; then
    [[ -n "$old_target" ]] && atomic_link "$old_target" "$PREVIOUS_LINK"
    trap - EXIT
    log "Deployment healthy at commit $(cat "$candidate/.release-complete")"
    cleanup_releases
    return 0
  fi

  mark_failed "$candidate"
  if [[ -n "$old_target" ]]; then
    log "Activation failed; restoring $(basename "$old_target")"
    atomic_link "$old_target" "$CURRENT_LINK"
    restart_process || true
    healthcheck || fail "Candidate failed and the last-known-good release did not recover"
  else
    log "First Node activation failed; no last-known-good Node release exists"
    stop_process
    rm -f "$CURRENT_LINK"
  fi

  fail "Candidate activation failed; rollback completed"
}

case "${1:-}" in
  --rollback)
    manual_rollback "${2:-}"
    ;;
  "")
    deploy_candidate
    ;;
  *)
    fail "Usage: deploy.sh [--rollback [release-name]]"
    ;;
esac
