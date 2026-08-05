# Zwei Domains/Sites mit einer SvelteKit-Codebasis

Stand: 2026-08-04. Geprüft wurden der aktuelle Repository-Stand sowie ausschließlich Primärquellen von SvelteKit, Craft CMS und Nginx. Dies ist eine Entscheidungsnotiz; Anwendungsdateien wurden nicht geändert.

## Kurzfazit

Ja, das geht. Für den aktuellen Stand ist **ein gemeinsames SSR-Deployment mit `adapter-node`, das anhand des Hostnamens die Site auswählt**, die naheliegendste Variante.

- `davidhellmann.com` und `bestwebsite.gallery` können auf denselben Node-Prozess zeigen.
- Ein SvelteKit-Hook ordnet `event.url.hostname` einer kleinen Site-Konfiguration zu und legt sie in `event.locals` ab. Hooks laufen für jeden Server-Request; `locals` ist genau dafür gedacht, requestbezogene Daten an Server-Loads und Endpoints weiterzugeben. ([SvelteKit Hooks: `handle` und `locals`](https://svelte.dev/docs/kit/hooks#handle))
- Die Site-Konfiguration liefert mindestens Craft-Site-Handle, öffentliche Basis-URL, Branding/SEO und optional Features/Routen.
- Die bestehenden Craft-Queries besitzen bereits eine `$site`-Variable, verwenden aber fast überall den festen Default `davidhellmann_en`. Craft unterstützt `site`/`siteId` offiziell als Filter für Multi-Site-Elemente. ([Craft GraphQL Query Reference](https://craftcms.com/docs/5.x/development/graphql.html#query-reference))

Nur die technische Multi-Domain-Schicht ist klein. Die eigentliche Arbeit hängt danach davon ab, wie verschieden Navigation, Routen, SEO, RSS/Sitemaps und Komponenten der beiden Sites sein sollen.

## Lokaler Ist-Zustand

- `svelte.config.js` verwendet bereits `@sveltejs/adapter-node` mit Ausgabe nach `build`; die Anwendung ist derzeit SSR-fähig.
- Es gibt bereits `src/hooks.server.ts` und damit einen natürlichen Ort für die Host-zu-Site-Zuordnung.
- Die GraphQL-Operationen unter `src/lib/graphql/queries/entries/` akzeptieren bereits `$site`, meist mit `davidhellmann_en` als Default. Die Wrapper in `src/lib/graphql/cms-content.ts` reichen einen Site-Wert aber noch nicht systematisch durch.
- Die generierten Entry-Fragmente enthalten bereits `siteHandle` und `siteId`.
- Mehrere Stellen sind absichtlich auf die bestehende Site zugeschnitten, unter anderem `src/app.html`, Footer-Links, RSS/LLM-Ausgaben, `src/routes/[filename=files]/+server.ts` und feste Canonical-/Asset-URLs. Diese Stellen müssten für eine vollständig saubere zweite Site inventarisiert werden.

## Variante A: eine Codebasis, zwei statische Builds und zwei Deployments

### Modell

Ein Build läuft mit `SITE=davidhellmann`, ein zweiter mit `SITE=bestwebsite`; jeder erzeugt sein eigenes statisches Artefakt und wird separat an die jeweilige Domain ausgeliefert. SvelteKits `adapter-static` prerendert die Anwendung als Sammlung statischer Dateien; dynamische Pfade müssen über Crawling oder `entries()` vollständig bekannt sein. ([SvelteKit Static Site Generation](https://svelte.dev/docs/kit/adapter-static), [SvelteKit Page Options: `entries`](https://svelte.dev/docs/kit/page-options#entries))

### Vorteile

- Sehr klare Isolation: Jede Domain hat ihr eigenes Artefakt, eigenes Rollback und kann unabhängig deployt werden.
- Keine Host-Verzweigung zur Request-Zeit und kein dauerhaft laufender Node-Prozess.
- Ein Fehler oder Deploy der einen Site muss die andere nicht betreffen.

### Nachteile für dieses Repo

- Der aktuelle Stand verwendet bewusst `adapter-node`, nicht `adapter-static`, und hat keine flächendeckende Prerender-Konfiguration. Für einen Static-Build müssten alle CMS-Routen und dynamischen Slugs wieder enumeriert/prerendered werden.
- Jeder Content-Deploy baut beide Sites beziehungsweise die betroffene Site vollständig neu. Buildzeit und CI-/Deployment-Logik verdoppeln sich.
- Gemeinsame Codebasis bedeutet trotzdem zwei Deployment-Ziele, TLS-/Domain-Konfigurationen und Artefakte.
- Falls Preview, requestabhängige CMS-Daten oder andere dynamische Endpoints benötigt werden, muss dafür eine Zusatzlösung bestehen. `adapter-static` kann nicht zugleich beliebige SSR-Seiten bedienen; SvelteKit verlangt für einen Mix einen anderen Adapter. ([SvelteKit Static Site Generation](https://svelte.dev/docs/kit/adapter-static))

### Grober Aufwand

- Multi-Site-Buildparameter und zwei Deploy-Pipelines: etwa **1–2 Tage**, wenn beide Sites bereits vollständig prerenderbar und ihre Routen überschaubar sind.
- Für den aktuellen SSR-Stand inklusive vollständiger dynamischer Route-Enumeration und Build-Verifikation eher **2–5 Tage**, je nach Contentmenge und Sonderendpoints; UI-/Komponentenarbeit nicht eingerechnet.

### Einordnung

Technisch sauber, wenn statische Artefakte und maximale Isolation das Ziel sind. Für den aktuellen Node-Stand ist es mehr Umbau als nötig.

## Variante B: ein SSR-Build, ein Deployment, Routing nach Hostname

### Modell

Beide Domains zeigen per DNS/TLS auf denselben Reverse Proxy und von dort auf denselben `adapter-node`-Prozess. Nginx kann mehrere Hostnamen einem Serverblock zuordnen und den ursprünglichen Host an den Upstream weiterreichen. ([Nginx Server Names](https://nginx.org/en/docs/http/server_names.html), [Nginx Proxy Module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html))

Wichtig ist die Origin-Konfiguration: Ein fixes `ORIGIN=https://davidhellmann.com` kann nur eine öffentliche Origin repräsentieren. Für mehrere Domains sollte der vertrauenswürdige Reverse Proxy `X-Forwarded-Host` und `X-Forwarded-Proto` setzen und der Node-Prozess mit `HOST_HEADER=x-forwarded-host` sowie `PROTOCOL_HEADER=x-forwarded-proto` laufen. SvelteKit dokumentiert diesen Weg ausdrücklich und warnt, solche Header nur hinter einem vertrauenswürdigen Proxy zu akzeptieren. ([SvelteKit `adapter-node`: Origin und Proxy-Header](https://svelte.dev/docs/kit/adapter-node#environment-variables-origin-protocol_header-host_header-and-port_header))

In der Anwendung gibt es zwei sinnvolle Zuschnitte:

1. **Gleiche Routen, anderer Content:** `handle` mappt den Host auf `event.locals.site`; Server-Loads geben den zugehörigen Craft-Site-Handle als GraphQL-Variable weiter.
2. **Unterschiedliche Routensätze:** Ein `reroute`-Hook kann etwa `bestwebsite.gallery/foo` intern auf eine eigene Routengruppe abbilden, ohne die Browser-URL zu ändern. SvelteKit führt `reroute` vor der Routenauswahl auf Server und Client aus. ([SvelteKit Hooks: `reroute`](https://svelte.dev/docs/kit/hooks#reroute))

Craft selbst passt zu diesem Modell: Eine Installation kann mehrere Sites mit unterschiedlichen Hostnamen verwalten, und Site-Handle/Base-URL sind Teil des Multi-Site-Modells. ([Craft Sites & Localization](https://craftcms.com/docs/5.x/system/sites))

### Vorteile

- Nur ein Build, ein Node-Prozess und eine Deploy-Pipeline.
- Gemeinsame Komponenten, Utilities und GraphQL-Fragmente ohne Paket-/Monorepo-Overhead.
- Die Sites dürfen trotzdem unterschiedliche Layouts und interne Routengruppen haben.
- Der bestehende `adapter-node`-Betrieb bleibt erhalten.

### Nachteile

- Beide Domains teilen Release und Laufzeit: Ein kaputter Deploy oder Prozess betrifft beide.
- Site-Kontext darf in keinem Query, Cache-Key, Canonical-Link, Feed oder Sitemap vergessen werden. Caches müssen mindestens Host/Site als Teil ihres Keys verwenden.
- Ein unbekannter/spoofbarer Host sollte nicht still auf die Primärsite fallen; der Proxy und die Anwendung sollten nur erlaubte Hosts akzeptieren.
- Bei stark auseinanderlaufenden Produkten kann die gemeinsame Anwendung langfristig unübersichtlich werden, obwohl sie technisch funktioniert.

### Grober Aufwand

- **Proof of Concept/Infrastruktur:** etwa **2–4 Stunden** für zweite Domain/TLS, Proxy-Header, Host-Mapping und einen exemplarischen Craft-Query.
- **Produktionsreife Site-Schicht:** etwa **1–3 Tage** für typisierte Site-Konfiguration, `locals`/Root-Layout, konsequente GraphQL-Variablen, Host-Validierung sowie Tests für Canonicals, SEO, RSS/Sitemaps und Assets.
- Abweichende Seitenstruktur, Design und Komponenten von Best Website Gallery kommen danach zusätzlich dazu; bei komplett anderem Routensatz eher **mehrere weitere Tage**.

### Empfehlung

Für dieses Repo zuerst diese Variante umsetzen. Der minimale Architektur-Schnitt wäre:

```text
hostname -> SiteConfig -> event.locals.site
                         -> Craft GraphQL `site`
                         -> Layout/SEO/Navigation/Feeds
```

Die Site-Konfiguration sollte eine explizite Allowlist sein und nicht aus beliebigen Hostnamen dynamisch erzeugt werden.

## Variante C: ein statischer Build mit Hosting-Rewrites oder Subpaths

### Was möglich ist

- Wenn beide Domains **exakt dasselbe HTML und dieselben Pfade** ausliefern sollen, kann ein statischer Output problemlos an beide Domains gehängt werden. Das sind dann aber keine zwei eigenständigen Sites und es entstehen gegebenenfalls Duplicate-Content-/Canonical-Themen.
- Wenn die Sites öffentlich unter echten Unterpfaden wie `/davidhellmann` und `/bestwebsite` leben dürfen, kann SvelteKit mit `kit.paths.base` unter einem Subpath betrieben werden. Dieser `base` ist jedoch eine einzelne Build-Konfiguration, kein requestabhängiger Host-Schalter. ([SvelteKit Configuration: `paths.base`](https://svelte.dev/docs/kit/configuration#paths))

### Warum Host-Rewrites hier nicht sauber helfen

Für zwei Domains, die beide ihre eigene Startseite unter `/` brauchen, werden zwei unterschiedliche `index.html`-Artefakte an derselben öffentlichen URL benötigt. Ein Host-Rewrite kann zwar serverseitig verschiedene Verzeichnisse auswählen; ein einzelner normaler SvelteKit-Static-Build erzeugt aber nicht zwei hostabhängige Varianten derselben Route. Versteckte interne Präfixe erzeugen zusätzlich Unterschiede zwischen sichtbarer URL, SvelteKit-Routenmanifest, Hydration und Client-Navigation.

Praktisch landet man damit entweder wieder bei **zwei Build-Artefakten** (Variante A) oder bei **hostabhängigem SSR/Edge-Rendering** (Variante B). Eine Rewrite-Sonderkonstruktion wäre schwerer zu testen als beide sauberen Modelle.

### Grober Aufwand

Für identischen Content: **unter einem halben Tag** Hosting-Konfiguration. Für wirklich unterschiedliche Sites am Domain-Root: nicht als „ein statischer SvelteKit-Build“ empfohlen; die Sonderlogik dürfte **mindestens 1–3 Tage** kosten und bleibt betrieblich fragiler.

## Entscheidung in einem Satz

**Ein SvelteKit kann beide Domains abfeiern; mit dem aktuellen `adapter-node` ist ein gemeinsames SSR-Deployment plus explizite Host→Site-Konfiguration der kleinste und sauberste Weg.** Zwei statische Builds sind die isoliertere Alternative, ein einzelner statischer Build mit transparenten Host-Rewrites ist für zwei unterschiedliche Root-Sites kein guter Fit.
