# SvelteKit `adapter-node` auf Laravel Forge

Stand: 2026-07-29. Untersucht wurden die aktuelle lokale Anwendung und ausschließlich Primärquellen von SvelteKit, Laravel Forge, Vite und Nginx. Dies ist eine Entscheidungs- und Betriebsnotiz; es wurden keine Anwendungsdateien geändert.

## Kurzfazit

Für diese Anwendung ist ein gemischter Build mit `adapter-node` sinnvoll, wenn vor allem die vielen paginierten Archivseiten den 10-Minuten-Build sprengen:

- Stabile Einstiegsseiten und ausgewählte Detailseiten können weiterhin beim Build prerendered werden.
- Paginationsseiten können bei jedem Request per SSR erzeugt werden.
- `adapter-node` speichert SSR-Seiten **nicht automatisch nach dem ersten Aufruf als HTML-Cache**. SvelteKit führt ihre `load`-Funktionen grundsätzlich zur Laufzeit aus. HTTP-Caching muss über `Cache-Control`, CDN oder einen expliziten Nginx-`proxy_cache` konfiguriert werden.
- In diesem Repo existiert zusätzlich ein eigener, pro Node-Prozess lebender Daten-Cache (`src/lib/data/entries-cache.ts`). Er lädt Blog, Photos oder Work beim ersten Zugriff komplett und hält die Daten ohne TTL bis zum Prozessneustart. Das ist kein Seiten- oder HTTP-Cache.
- Der Wechsel zum Node-Adapter allein beseitigt das Forge-Limit nicht: Forge bricht Deployments weiterhin nach 10 Minuten ab. Nur weniger Prerender-Arbeit oder ein außerhalb von Forge erzeugtes Build-Artefakt verkürzt den Deploy zuverlässig. [Forge dokumentiert das 10-Minuten-Limit ausdrücklich](https://forge.laravel.com/docs/sites/deployments).

## Lokaler Ist-Zustand

- `package.json`: SvelteKit `^2.70.1`, Vite `^8.1.5`, pnpm-Lockfile.
- `svelte.config.js`: `adapter-static`, gemeinsames Ausgabeziel `build`, SPA-Fallback `200.html`, `precompress: false`, `strict: true`, `kit.prerender.crawl: false`.
- Praktisch alle Page- und Server-Routen exportieren aktuell `prerender = true`.
- Die Archiv-Routen `/blog/[[page=page]]` und `/photos/[[page=page]]` sowie Kategorie-/Topic-Archive generieren über `entries()` explizit **jede** Seite. `crawl: false` spart hier nichts, weil die Routen bereits programmgesteuert vollständig aufgezählt werden.
- `deploy.sh` baut in einem Cache-Verzeichnis, kopiert anschließend nur den Inhalt von `build/` in ein Release und löscht den Cache. Das genügt für statische Dateien, aber nicht für den Node-Server.
- Das Deployment verwendet bereits Releases plus atomisch umgeschalteten `current`-Symlink. Das schützt den Build-Schritt, ersetzt bei einem langlebigen Node-Prozess aber keinen Prozessneustart.

## Änderungen in der SvelteKit-Anwendung

### Adapter und Build

`@sveltejs/adapter-node` wird als Dev-Dependency installiert und in `svelte.config.js` verwendet. Die offizielle Konfiguration ist:

```js
import adapter from "@sveltejs/adapter-node";

export default {
  kit: {
    adapter: adapter({
      out: "build",
      precompress: false
    })
  }
};
```

Installation, Default-Ausgabe `build` und Start mit `node build` sind in der [offiziellen `adapter-node`-Dokumentation](https://svelte.dev/docs/kit/adapter-node) beschrieben. Hinter Nginx ist `precompress: false` vertretbar: SvelteKit empfiehlt, Kompression typischerweise am Reverse Proxy zu erledigen, weil Node single-threaded ist. Falls Nginx keine Kompression übernimmt, kann der Adapter mit seinem Default `precompress: true` gzip- und Brotli-Dateien erzeugen; das kostet zusätzliche Build-Zeit.

Der heutige `fallback: "200.html"` gehört ausschließlich zur Static-/SPA-Konfiguration und entfällt. Ein Node-Server behandelt dynamische Routen und 404-Antworten selbst. SvelteKit hält ausdrücklich fest, dass für einen Mix aus prerendered und dynamisch servergerenderten Seiten ein anderer Adapter als `adapter-static` nötig ist: [Static site generation](https://svelte.dev/docs/kit/adapter-static).

### Node-Version

Der lokale Build verwendet Vite 8. Die [aktuelle offizielle Vite-Anforderung](https://vite.dev/guide/) lautet Node `20.19+` oder `22.12+`; auf Forge sollte daher eine aktuelle Node-22- oder Node-24-LTS-Version verwendet und mit `node -v` geprüft werden. Forge installiert auf neuen App-/Web-Servern Node und Supervisor; bestehende Server können älter sein. Siehe [Forge Server Types](https://forge.laravel.com/docs/servers/types) und [Forge Server Knowledge Base](https://forge.laravel.com/docs/knowledge-base/servers).

## Was sich auf Forge ändern muss

### 1. Vollständiges lauffähiges Release behalten

Nach dem Build benötigt `adapter-node` laut [offizieller Deployment-Dokumentation](https://svelte.dev/docs/kit/adapter-node):

- den Ausgabeordner `build/`,
- `package.json`,
- die Produktions-Dependencies in `node_modules`.

Das aktuelle Muster „nur `build/*` kopieren, danach den Installationsordner löschen“ ist damit unvollständig. Zwei robuste Varianten:

1. Im eigentlichen Release-Verzeichnis clonen, `pnpm install --frozen-lockfile`, `pnpm build` und optional `pnpm prune --prod` ausführen; danach das gesamte Release aktivieren.
2. `build/`, `package.json`, `pnpm-lock.yaml` ins Release kopieren und dort die Produktions-Dependencies installieren.

Variante 1 passt am besten zum vorhandenen atomischen Release-Modell und vermeidet eine zweite Installation. Werden alte Releases aufgeräumt, muss der Node-Daemon zuerst erfolgreich auf das neue Release umgeschaltet und geprüft sein.

### 2. `.env` zur Build- und Laufzeit richtig behandeln

In Development/Preview lädt SvelteKit `.env` automatisch, in Produktion aber nicht. Offiziell unterstützt sind beispielsweise:

```sh
node --env-file=.env build
```

ab Node 20.6 oder `node -r dotenv/config build`; siehe [`adapter-node`: Environment variables](https://svelte.dev/docs/kit/adapter-node#environment-variables).

Für dieses Repo gilt zusätzlich:

- `GQL_API_URL` und `GQL_API_TOKEN` werden aus `$env/static/private` importiert und deshalb beim **Build** statisch in den privaten Server-Bundle eingesetzt. Änderungen daran benötigen einen neuen Build; sie gelangen nicht in den Client-Bundle.
- `PORT`, `HOST` und `ORIGIN` sind Laufzeitwerte des Node-Servers.
- Das heutige Script kopiert `.env` nur ins temporäre Build-Verzeichnis. Für `node --env-file=.env build` muss `.env` auch im aktivierten Release vorhanden sein, idealerweise als Symlink auf die bestehende Shared-Datei.

Forge kann `.env` im Site-Panel verwalten; bei Forge-eigenem Zero-Downtime-Deployment wird es als Shared Path verlinkt. Siehe [Forge Environment Variables](https://forge.laravel.com/docs/sites/environment-variables) und [Forge Deployments: Shared paths](https://forge.laravel.com/docs/sites/deployments).

### 3. Node-Server als Forge Background Process/Daemon

Forge verwaltet langlebige Prozesse mit Supervisor und startet unerwartet beendete Prozesse neu. Konfiguriert werden Command, Working Directory, User, Anzahl Prozesse, Start Seconds, Stop Seconds und Stop Signal; siehe [Forge Background Processes](https://forge.laravel.com/docs/resources/background-processes).

Passende Basiskonfiguration für das vorhandene Verzeichnislayout:

```text
Command:
node --env-file=.env build

Working directory:
/home/forge-sveltekit-davidhellmann/sveltekit.davidhellmann.com/current

User:
forge

Processes:
1
```

Empfohlene Laufzeitwerte in `.env`:

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
ORIGIN=https://sveltekit.davidhellmann.com
SHUTDOWN_TIMEOUT=30
```

Der Server hört standardmäßig auf `0.0.0.0:3000`; hinter Nginx ist `127.0.0.1` enger und ausreichend. `ORIGIN` ist die einfachste, sichere Konfiguration für genau einen öffentlichen Host. Bei mehreren Hostnamen können alternativ `PROTOCOL_HEADER=x-forwarded-proto` und `HOST_HEADER=x-forwarded-host` verwendet werden, aber SvelteKit warnt, diese nur hinter einem vertrauenswürdigen Proxy zu akzeptieren. Alle Werte sind in [`adapter-node`: PORT/HOST und ORIGIN](https://svelte.dev/docs/kit/adapter-node#environment-variables) dokumentiert.

Als Stop Signal sollte `SIGTERM` verwendet werden; „Stop Seconds“ sollte etwas über `SHUTDOWN_TIMEOUT` liegen, z. B. 35 Sekunden. `adapter-node` reagiert auf `SIGTERM`/`SIGINT`, nimmt keine neuen Requests mehr an, lässt laufende Requests auslaufen und beendet sie nach dem Shutdown-Timeout. Siehe [`adapter-node`: Graceful shutdown](https://svelte.dev/docs/kit/adapter-node#graceful-shutdown).

Logs des Forge-Daemons liegen standardmäßig unter `/home/forge/.forge/daemon-*.log`.

### 4. Nginx von statischen Dateien auf Reverse Proxy umstellen

Die Site darf nicht länger mit `try_files ... /200.html` aus `current` bedient werden. Stattdessen müssen Requests zum lokalen Node-Port gehen. Minimaler `location`-Block:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

`proxy_pass` und das Setzen von Request-Headern sind im [offiziellen Nginx Reverse-Proxy-Leitfaden](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) beschrieben. SvelteKits Default-Server bedient selbst `build/client`, `build/prerendered` und danach SSR; ein separates `alias` auf interne Build-Unterordner ist für den Start nicht nötig.

Die Forge-Nginx-Konfiguration wird im Site-Panel bearbeitet. Vor dem Reload muss sie getestet werden (`sudo nginx -t`); Forge warnt, dass ungültige Templates bestehende Sites unerreichbar machen können. Siehe [Forge Nginx Templates](https://forge.laravel.com/docs/servers/nginx-templates).

### 5. Daemon nach jedem erfolgreichen Deploy neu starten

Nach Build und atomischem Wechsel von `current`:

```sh
sudo supervisorctl restart daemon-<ID>:*
```

Forge dokumentiert genau dieses Muster und verlangt bei Zero-Downtime-Releases den Neustart **nach** `$ACTIVATE_RELEASE()`: [Restarting background processes](https://forge.laravel.com/docs/sites/deployments#restarting-background-processes).

Wichtig: Der Symlink-Wechsel allein aktualisiert einen laufenden Node-Prozess nicht. Dieser hat das alte Server-Bundle bereits geladen.

### 6. Zero-Downtime-Grenzen

Das bestehende Script macht den Dateisystemwechsel atomisch, aber ein einzelner Supervisor-Prozess wird bei `restart` gestoppt und danach neu gestartet. SvelteKits Graceful Shutdown schützt laufende Requests, garantiert mit nur einem Upstream jedoch keinen lückenlosen Übergang für neue Requests; während des kurzen Startfensters kann Nginx einen 502 liefern.

Echte lückenlose Deployments benötigen z. B. zwei wechselnde Ports/Prozesse mit Healthcheck und anschließendem Nginx-Upstream-Wechsel oder systemd Socket Activation. SvelteKit unterstützt Socket Activation offiziell, aber das wäre eine zusätzliche Betriebsarchitektur. Für diese kleine Site ist zunächst „atomisches Release + schneller Supervisor-Restart + Forge Healthcheck“ wahrscheinlich der angemessene Kompromiss.

Forge-eigenes Zero-Downtime-Deployment ist laut aktueller Dokumentation nur beim Erstellen einer neuen Site aktivierbar, nicht nachträglich für eine bestehende Site. Forge beschreibt seine `$CREATE_RELEASE()`-/`$ACTIVATE_RELEASE()`-Macros und Healthchecks in [Deployments](https://forge.laravel.com/docs/sites/deployments). Das vorhandene Custom-Script kann sein Release-Modell weiterverwenden.

## Cache-Semantik

### Prerendered Routen

Eine Route mit `prerender = true` wird beim Build ausgeführt und als feste HTML-/Data-Datei in `build/prerendered` abgelegt. `adapter-node` prüft prerendered Inhalte vor SSR und bedient sie als Datei; sie ändern sich erst mit dem nächsten Build. Gehashte Client-Artefakte unter `immutable` erhalten vom offiziellen Node-Handler ein einjähriges `Cache-Control: public,max-age=31536000,immutable`. Der Handler-Quellcode ist im [offiziellen SvelteKit-Repository](https://github.com/sveltejs/kit/blob/main/packages/adapter-node/src/handler.js) einsehbar.

### Dynamische SSR-Routen

SvelteKit dokumentiert: Eine `load`-Funktion läuft zur Laufzeit, außer die Seite wird prerendered – dann läuft sie beim Build. Es gibt beim Node-Adapter keinen automatischen „erster Request rendert, folgende Requests bekommen dieselbe HTML-Datei“-Mechanismus. Siehe [Loading data: When does which load function run?](https://svelte.dev/docs/kit/load#universal-vs-server-when-does-which-load-function-run).

Gewünschtes HTTP-Caching wird explizit gesetzt:

```ts
export const load = async ({ setHeaders }) => {
  setHeaders({
    "cache-control": "public, s-maxage=300, stale-while-revalidate=3600"
  });

  // ...
};
```

SvelteKit nennt `setHeaders` ausdrücklich als Weg, das Seiten-HTML zu cachen: [Loading data: Headers](https://svelte.dev/docs/kit/load#headers). Ob `s-maxage` wirkt, hängt von einem vorgeschalteten Cache/CDN ab.

Nginx puffert Proxy-Responses standardmäßig, **cached** sie aber nicht: `proxy_cache` steht standardmäßig auf `off`. Siehe [Nginx `proxy_cache`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache). Ein Nginx-Cache sollte erst mit einer bewussten Policy für Cookies, Authorization, Preview-URLs und Purging aktiviert werden.

### Der vorhandene In-Memory-Daten-Cache

`src/lib/data/entries-cache.ts` hat zwei modulweite Maps (`caches` und `fetchPromises`) und keine TTL:

- erster SSR-Zugriff auf Blog/Photos/Work: alle CMS-Einträge werden in Batches geladen;
- weitere Requests im selben Node-Prozess: dieselbe Map wird wiederverwendet;
- Restart/Crash/Deploy oder ein zweiter Worker: eigener leerer Cache;
- CMS-Änderungen: werden ohne Prozessneustart nicht sichtbar.

Bei statischem Betrieb lebte diese Map nur für den Build. Mit SSR wird sie zu einem langlebigen Prozess-Cache. Das kann die zweite Anfrage schnell machen, aber der erste Zugriff bleibt teuer und die Daten können unbegrenzt veralten. Kategorie-/Topic-Archive verwenden dagegen direkte GraphQL-Abfragen und werden nach aktuellem Code pro SSR-Request neu geladen.

## Mixed Prerendering für Pagination

### Page Options sind hier pro Route, nicht pro Parameterwert

SvelteKit-Optionen können in Page-/Layout-Modulen gesetzt werden; Kinder überschreiben Eltern. `prerender` kann pro Bereich gemischt werden. Siehe [Page options](https://svelte.dev/docs/kit/page-options).

Aber `/blog` und `/blog/2` gehören in diesem Repo beide zu **derselben** Route:

```text
src/routes/blog/[[page=page]]/+page.server.ts
```

Darum kann dieses Modul nicht `prerender = true` nur für `params.page === undefined` und `false` für `params.page === "2"` exportieren. Page Options werden statisch analysiert und nicht requestabhängig berechnet.

Es gibt zwei saubere Modelle:

#### Modell A: Route behalten und `prerender = "auto"` verwenden

```ts
export const prerender = "auto";

export const entries = () => [{ page: undefined }];
```

`"auto"` bedeutet: angegebene/entdeckte Pfade werden prerendered, die Route bleibt aber zusätzlich im SSR-Manifest. SvelteKit nennt genau den Fall „einige Blog-Slugs prerendern, den Long Tail server-rendern“ als Zweck von `"auto"`: [Page options: prerender](https://svelte.dev/docs/kit/page-options#prerender).

Ergebnis:

- `/blog` wird beim Build erzeugt;
- `/blog/2`, `/blog/3`, … bleiben SSR-fähig;
- `/blog/1` kann weiterhin zur kanonischen `/blog`-URL redirecten und muss nicht prerendered werden.

Dasselbe gilt für `/photos/[[page=page]]`.

Für Kategorie/Topic-Routen mit erforderlichem `slug` kann `entries()` nur die Index-Pfade liefern:

```ts
[
  { slug: "category-a", page: undefined },
  { slug: "category-b", page: undefined }
]
```

Dann sind die Kategorie-Indizes statisch, ihre Seiten 2+ dynamisch. Falls auch die Kategorie-Indizes dynamisch sein dürfen, kann dort `prerender = false` verwendet und die teure `entries()`-Schleife ganz entfernt werden.

#### Modell B: Index und Pagination in zwei Routen trennen

```text
src/routes/blog/+page.server.ts                  prerender = true
src/routes/blog/[page=page]/+page.server.ts      prerender = false
```

Dieses Modell macht die Grenze besonders explizit, benötigt aber eine kleine Umstrukturierung und gemeinsam genutzte Lade-Logik. Für die aktuelle Struktur ist Modell A die kleinere Änderung.

### Wichtige `entries`-/Crawler-Fallen

- Die bestehenden `entries()`-Funktionen zählen alle Seiten auf. Wenn sie unverändert bleiben, werden mit `"auto"` weiterhin alle genannten Seiten prerendered.
- `getPagedArchiveRoutes()` liefert derzeit `page: undefined`, `"1"` und alle weiteren Seiten. Für „nur Index statisch“ darf diese Funktion nicht unverändert als Entry Generator verwendet werden.
- `kit.prerender.crawl` ist standardmäßig `true` und folgt Links von Entry Points. Ein Pagination-Link von `/blog` auf `/blog/2` kann dadurch Seite 2 wieder in den Prerender-Build ziehen. Das aktuelle `crawl: false` ist deshalb für ein exakt kontrolliertes Mixed-Set sinnvoll.
- `kit.prerender.entries` hat standardmäßig `["*"]`; `*` schließt nicht-dynamische Routen und optionale Parameter in ihrer leeren Form ein. Das hilft für `/blog`, nicht aber für erforderliche Kategorie-Slugs. Siehe [SvelteKit Configuration: prerender](https://svelte.dev/docs/kit/configuration#prerender).
- Dynamische, wirklich `prerender = true` gesetzte Routen müssen vollständig erreicht oder durch `entries()` angegeben werden. Sonst schlägt der Build standardmäßig mit „marked as prerenderable, but were not prerendered“ fehl. Eine `"auto"`-Route kann bei nicht erzeugten Pfaden auf SSR zurückfallen; siehe [Page options: Troubleshooting](https://svelte.dev/docs/kit/page-options#prerender-troubleshooting).

## Empfohlener Zuschnitt für dieses Repo

Kleine, risikoarme erste Stufe:

1. Home und About bleiben `prerender = true`.
2. Work-Index bleibt `prerender = true`.
3. Blog- und Photos-Archiv wechseln auf `prerender = "auto"` und erzeugen nur `page: undefined`.
4. Kategorie-/Topic-Archive entweder komplett SSR oder `"auto"` nur für `{ slug, page: undefined }`; die aktuellen Count-Abfragen pro Taxonomie entfallen für Seiten 2+ aus dem Build.
5. Blog-/Work-/Photo-Detailseiten können zunächst prerendered bleiben. Wenn der Build noch immer über 10 Minuten dauert, sind deren großen `entries()`-Mengen der nächste Hebel: `"auto"` nur für ausgewählte Inhalte oder komplett SSR.
6. `crawl: false` bleibt bestehen, solange das Prerender-Set ausschließlich durch `["*"]` und präzise `entries()` kontrolliert wird.
7. Erst nach Messung HTTP-Caching für öffentliche SSR-Archive ergänzen. Der vorhandene Daten-Cache benötigt vorher eine TTL-/Invalidierungsentscheidung, weil er sonst CMS-Inhalte bis zum nächsten Restart festhält.

Diese Aufteilung behält die schnellen, build-stabilen Einstiegsseiten bei und entfernt gerade die kombinatorische Pagination-Arbeit aus dem Forge-Build.
