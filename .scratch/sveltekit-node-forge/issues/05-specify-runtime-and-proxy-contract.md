Title: Specify the Supervisor and Nginx runtime contract
Type: grilling
Status: resolved
Blocked by: 02, 03

## Question

How should Forge run and expose the `adapter-node` server in staging and production?

Specify the Supervisor command, working directory, user, process count, signals, shutdown/start timeouts and logs; the loopback port and origin/proxy-header policy; Nginx proxy behavior, compression and static asset handling; healthcheck behavior; and the acceptable short restart window. Do not introduce HTML caching in the initial contract.

## Answer

Run one independent `adapter-node` process behind one independent Nginx virtual host for each Forge site. Production and staging share the same runtime/proxy policy but no process, port, working directory, environment file, daemon identifier, or log file.

### Supervisor processes

Create one site-level Forge background process for each environment with descriptive names such as `sveltekit-production` and `sveltekit-staging`. Record each exact Forge-assigned `daemon-<id>:*` identifier in that site's deploy bootstrap; deployment and rollback commands must never use a wildcard capable of addressing both environments.

| Setting | Production | Staging |
| --- | --- | --- |
| Command | `node --env-file=.env build` | `node --env-file=.env build` |
| Working directory | `/home/forge/davidhellmann.com/current` | `/home/forge/stage.davidhellmann.com/current` |
| User | `forge` | `forge` |
| Processes | `1` | `1` |
| Start Seconds | `2` | `2` |
| Stop Signal | `SIGTERM` | `SIGTERM` |
| Stop Seconds | `35` | `35` |

Supervisor keeps the single long-running process alive and restarts it after an unexpected exit. Application output goes only to stdout/stderr and is collected in the environment's Forge-managed `/home/forge/.forge/daemon-*.log`; do not create application log files in releases or add a separate logging service in this migration. See [Forge background processes](https://forge.laravel.com/docs/resources/background-processes).

### Runtime environment

Each site's linked `.env` includes:

| Variable | Production | Staging |
| --- | --- | --- |
| `NODE_ENV` | `production` | `production` |
| `HOST` | `127.0.0.1` | `127.0.0.1` |
| `PORT` | `3000` | `3001` |
| `ORIGIN` | `https://davidhellmann.com` | `https://stage.davidhellmann.com` |
| `SHUTDOWN_TIMEOUT` | `30` | `30` |

Do not set `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`, `ADDRESS_HEADER`, or `XFF_DEPTH`. Each environment has one canonical public origin, so fixed `ORIGIN` is simpler and avoids trusting request-supplied host/protocol values. The application does not currently call `getClientAddress()`, so no forwarded client-IP header needs to become an application trust boundary. See [SvelteKit adapter-node environment variables](https://svelte.dev/docs/kit/adapter-node#environment-variables).

On `SIGTERM`, the default SvelteKit Node server stops accepting new requests, lets in-flight requests complete, and force-closes remaining connections after 30 seconds. Supervisor waits five additional seconds before forcing termination. The later homepage readiness loop remains responsible for determining application readiness; Supervisor's two-second start threshold only identifies an immediately crashing process.

### Nginx reverse proxy

Replace the static-site `try_files`/SPA fallback with a reverse proxy. Production uses:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
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

Staging uses the identical block with upstream port `3001`, plus the Basic Auth and indexing controls specified in [Specify the Forge staging topology](03-specify-staging-topology.md). Nginx overwrites the forwarded headers rather than trusting incoming values, while SvelteKit continues to derive its canonical URL from `ORIGIN`.

Keep normal Nginx proxy buffering and request buffering. No WebSocket upgrade configuration is required by the current application. With `proxy_intercept_errors off`, SvelteKit owns redirects, canonical responses, 404s, and application errors. With `proxy_cache off`, Nginx performs no initial HTML/SSR response caching; the later cache ticket may alter this only after staging evidence.

Test every manual Nginx edit with `sudo nginx -t` before reloading it. A failed configuration test must leave the active configuration untouched.

### Compression and static assets

- Configure `adapter-node` with `precompress: false`.
- Let Nginx gzip suitable proxied responses, with `gzip_vary on`, a sensible minimum size such as `1024`, and types covering CSS, JavaScript, JSON, XML, SVG, and plain text in addition to HTML. Brotli is not required for the initial migration.
- Send every request, including SvelteKit client assets and files from `static/`, through `adapter-node`. Do not couple Nginx to `build/client`, `build/prerendered`, or another release-internal path with `alias` or `try_files`.
- Do not override application `Cache-Control` headers. SvelteKit's hashed immutable assets retain their long-lived immutable policy; other resources retain the adapter/application policy.

Handling compression in the existing reverse proxy avoids doing CPU work in the single-threaded Node process. See [SvelteKit response compression guidance](https://svelte.dev/docs/kit/adapter-node#compressing-responses) and [Nginx gzip](https://nginx.org/en/docs/http/ngx_http_gzip_module.html).

### Deploy healthcheck and restart boundary

Use the already-decided deployment check from [Design activation, healthcheck, and rollback](04-design-deployment-lifecycle.md): poll a real SSR homepage directly on the environment's loopback Node port for up to 60 seconds, with the canonical host/origin context. Do not add a dedicated health route. An external Forge healthcheck may later provide notification, but it is not the activation or rollback authority.

With a single process, new requests may receive a brief Nginx `502` between graceful shutdown and successful restart. This is an accepted operational boundary: do not add a maintenance response, second process, alternate upstream, socket activation, or retrying proxy architecture now. Staging must measure the real interruption; only evidence that the window is operationally unacceptable should reopen a separate blue/green or socket-activation decision.
