# Forge Node deployment

The application release lifecycle lives in `deploy.sh`. Forge only clones the candidate release and passes the site-specific port and Supervisor identifier to that script.

## Runtime environment

Each Forge site keeps its private environment at `<site-root>/shared/.env` with mode `0600` and owner `forge`.

Production:

```dotenv
GQL_API_URL=https://…
GQL_API_TOKEN=…
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
ORIGIN=https://davidhellmann.com
SHUTDOWN_TIMEOUT=30
```

Staging uses the same shape with:

```dotenv
PORT=3001
ORIGIN=https://stage.davidhellmann.com
```

The Craft URL and read-only token may deliberately be identical in both files. Keep Forge's “Make `.env` variables available to deployment script” setting disabled.

## Supervisor

Create one Forge background process per site:

```text
Command:            node --env-file=.env build
Working directory:  /home/forge/<site>/current
User:               forge
Processes:          1
Start Seconds:      2
Stop Signal:        SIGTERM
Stop Seconds:       35
```

Copy the exact generated Supervisor identifier (`daemon-<id>:*`) into the corresponding Forge bootstrap below. Never use a wildcard that could address both sites.

## Forge deploy bootstrap

Use this small script in Forge's deploy field. Set `APP_PORT` and `SUPERVISOR_PROCESS` per site; Forge supplies `FORGE_SITE_ROOT` and `FORGE_SITE_BRANCH`.

```bash
set -Eeuo pipefail

export APP_PORT=3001
export SUPERVISOR_PROCESS='daemon-REPLACE_WITH_STAGE_ID:*'
export DEPLOY_STARTED_AT="$(date +%s)"

REPO_URL='git@github.com:davidhellmann/com.davidhellmann.sveltekit.git'
RELEASE_NAME="$(date +%Y%m%d%H%M%S)"
RELEASE_PATH="$FORGE_SITE_ROOT/releases/$RELEASE_NAME"

mkdir -p "$FORGE_SITE_ROOT/releases" "$FORGE_SITE_ROOT/shared"

cleanup_failed_clone() {
  cd "$FORGE_SITE_ROOT"
  rm -rf -- "$RELEASE_PATH"
}
trap cleanup_failed_clone ERR

git clone --depth 1 --branch "$FORGE_SITE_BRANCH" "$REPO_URL" "$RELEASE_PATH"
trap - ERR

cd "$RELEASE_PATH"
bash deploy.sh
```

Production uses the same bootstrap with `APP_PORT=3000` and its own exact Supervisor identifier.

## Nginx

Replace static `try_files` handling with the environment's Node port:

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header Connection "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_connect_timeout 5s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    proxy_intercept_errors off;
    proxy_cache off;
}
```

Use port `3000` in production. Keep staging's `X-Robots-Tag` rules. Test with `sudo nginx -t` before reloading Nginx.

The proxy must own every application request. Remove the old route and file-serving blocks for:

- `/about`, `/blog/*`, and `/work/*`
- `/sitemap.xml`
- `*.md` and `*.json`
- CSS, JavaScript, images, fonts, HTML, and other static extensions
- the exact `/favicon.ico` and `/robots.txt` locations

Also remove the static trailing-slash rewrite and `error_page 404 /index.php`. Otherwise Nginx's more-specific locations can bypass the Node server even though `location /` is proxied. The hidden-file deny block may remain. SvelteKit then owns assets, redirects, 404s, Markdown, RSS, robots, and sitemap responses consistently.

## Manual rollback

The default target is the last health-checked predecessor:

```bash
cd /home/forge/stage.davidhellmann.com/current
FORGE_SITE_ROOT=/home/forge/stage.davidhellmann.com \
APP_PORT=3001 \
SUPERVISOR_PROCESS='daemon-REPLACE_WITH_STAGE_ID:*' \
bash deploy.sh --rollback
```

Pass a retained release name to select it explicitly:

```bash
bash deploy.sh --rollback 20260804190548
```

When using an explicit name, keep the same three environment variables from the first command. The script refuses incomplete, outside-root, and already-active targets, and restores the original release if the requested target fails its homepage healthcheck.
