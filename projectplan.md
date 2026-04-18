# Project Plan: Agent-Ready Content Delivery

## Scan-Ergebnis isitagentready.com (18.04.2026)

**Score: 25 / 100 — Level 1 „Basic Web Presence"**

| Kategorie | Score | Ergebnis |
|---|---|---|
| Discoverability | 67 (2/3) | ✅ robots.txt · ✅ sitemap.xml · ❌ Link headers (RFC 8288) |
| Content | 0 (0/1) | ❌ Markdown for Agents |
| Bot Access Control | 50 (1/2) | ✅ AI-bot rules in robots.txt · ❌ Content Signals · ⚪ Web Bot Auth (neutral) |

→ robots.txt + sitemap.xml sind also schon da. Es bleiben **drei reale Gaps**.

## Hosting-Constraint

Site läuft via `adapter-static` hinter Cloudflare. Das heißt:
- **Kein per-request Server-Code** möglich (kein `hooks.server.ts` zur Laufzeit)
- HTTP-Response-Header (`Link:`) und Content-Negotiation (`Accept: text/markdown`) müssen entweder
  - (a) über **Cloudflare Workers / `_headers`-Datei** (Pages) gelöst werden, oder
  - (b) durch **statische `.md`-URLs** umgangen werden (kein echtes Negotiation, aber crawler-freundlich)

## Tasks (sortiert nach Aufwand × Wirkung)

### Task A — `Content-Signal` in robots.txt ergänzen
- **Wirkung:** schließt Gap „Content Signals in robots.txt" → +1 Punkt Bot Access
- **Was:** in bestehender `robots.txt` Zeile ergänzen, z. B.:
  ```
  Content-Signal: search=yes, ai-input=yes, ai-train=no
  ```
- **Frage an dich:** wie willst du AI-Training erlauben? `yes` / `no` / nur für bestimmte Bots?
- **Datei:** `static/robots.txt` (falls SvelteKit sie ausliefert) **oder** robots.txt liegt im Craft/Hosting — dann musst du dort ergänzen
- **Aufwand:** 2 Min

### Task B — Markdown-Endpunkte pro Page (`/<slug>.md`)
- **Wirkung:** schließt Content-Gap (0/1 → 1/1) auch ohne Cloudflare-Worker
- **Was:** Neue Routes wie `src/routes/blog/[slug=slug]/+server.ts` mit Pfad-Suffix `.md` (oder dedizierte `[slug].md/+server.ts`-Route — SvelteKit unterstützt beides)
- **Konvertierung** ContentBuilder-Blocks → Markdown:
  - `block_text` (richText/HTML) → MD via simple HTML→MD Funktion (kein neues Package nötig — `node-html-parser` bereits da)
  - `block_code` → ` ``` `-Fence mit `language`
  - `block_quote` → `> quote\n— source`
  - `block_image` → `![alt](url)` + optional Caption
  - `block_cta` → `[label](url)`
  - `block_images` → Liste von `![]()`
  - `block_curriculumVitae`, `block_awards` → Tabellen oder Listen
- **Frontmatter** (YAML) mit Title, Date, Category, Topics, URL der HTML-Version
- **Pilot:** nur Blog. Wenn Pattern steht → Work, About in Folge-Task
- **Prerendert** über `entries`-Generator analog zur HTML-Variante
- **Aufwand:** ~45 Min für Pilot

### Task C — Link-Header (RFC 8288) auf der Homepage
- **Wirkung:** schließt Discoverability-Gap (2/3 → 3/3)
- **Was:** HTTP-Response-Header `Link: </llms.txt>; rel="llms-txt", </sitemap.xml>; rel="sitemap"` etc.
- **Wie (Optionen):**
  - **C1 — Cloudflare Pages `_headers`-File:** `static/_headers` mit Path-spezifischen Headern. Sauber, kein Worker nötig. Cloudflare-Pages-spezifisch.
  - **C2 — Cloudflare Worker:** flexibler, aber mehr Setup
  - **C3 — `<link rel="…">` im `<head>`:** funktioniert auch teilweise; isitagentready prüft aber explizit HTTP-Header
- **Empfehlung:** C1 falls Cloudflare Pages, sonst C2
- **Frage an dich:** Wie wird die Site deployed? Cloudflare Pages? Workers? Plain Static?
- **Aufwand:** 10 Min wenn Cloudflare Pages, 30 Min wenn Worker neu

### Task D — `llms.txt` Index hinzufügen (Bonus)
- isitagentready prüft das aktuell nicht direkt, aber Crawler nutzen es zunehmend
- Datei mit H1, Beschreibung, Linkliste der wichtigsten Seiten (Home, Blog-Archiv, Work, About) plus pro Section ein Block mit den Einzel-Links
- Generiert aus den vorhandenen Caches (`getBlogArray`, `getWorkArray`)
- **Aufwand:** ~20 Min

## Was ich bewusst NICHT mache

- ❌ Kein Echtzeit-Content-Negotiation via Server-Hook (passt nicht zu `adapter-static`)
- ❌ Kein neuer SDK / kein neues Markdown-Package (HTML→MD klein selber schreiben)
- ❌ Kein Refactor des SEO-Systems
- ❌ Web Bot Auth (request signing) — neutral bewertet, hoher Aufwand, niedriger Nutzen jetzt

## Offene Fragen vor dem Start

1. **Wo wird die Site deployed?** (Cloudflare Pages → `_headers` file, sonst Worker)
2. **Content-Signal Policy:** `ai-train=yes` oder `no`? `ai-input=yes` (deine Inhalte dürfen in LLM-Antworten zitiert werden)?
3. **Welche Tasks?** Mein Vorschlag: A + B (Pilot Blog) + C → bringt Score von 25 auf vermutlich ~75
4. **MD-Route Naming:** `blog/<slug>.md` oder `blog/<slug>/index.md`?

## Tasks-Checkliste

- [x] A: Content-Signal in robots.txt → als Seomatic-Snippet bereitgestellt (in PR-Beschreibung / Chat)
- [x] B: Markdown-Endpunkt für Blog-Einträge → `/blog/<slug>/llms.md`
- [x] C: Link-Header (RFC 8288) → `docs/nginx-link-headers.conf` zum Pasten in Forge
- [x] D: `llms.txt` Index → prerendered Route aus Caches

## Review

### Geänderte / neue Dateien

| Datei | Zweck |
|---|---|
| `src/routes/llms.txt/+server.ts` | NEU — prerendered llms.txt Index (llmstxt.org Format), aufgebaut aus `getBlogArray()` + `getWorkArray()` Caches |
| `src/routes/blog/[slug=slug]/llms.md/+server.ts` | NEU — pro Blog-Eintrag eine Markdown-Variante mit YAML-Frontmatter |
| `src/lib/utils/htmlToMarkdown.ts` | NEU — kleiner HTML→MD Converter für `richText` Felder, basiert auf `node-html-parser` (bereits dependency) |
| `src/lib/utils/blocksToMarkdown.ts` | NEU — ContentBuilder-Block-Renderer (text/code/quote/image/images/cta/award/cv) |
| `docs/nginx-link-headers.conf` | NEU — Nginx-Snippet für Forge mit `Link:` Headern (RFC 8288) und korrektem `text/markdown` Content-Type für `.md` |

### Außerhalb des Repos zu erledigen

- **robots.txt** in Seomatic (Craft) ergänzen → siehe Chat-Snippet. Wichtigste Zeile: `Content-Signal: search=yes, ai-input=yes, ai-train=no`
- **Nginx-Config** in Forge: Inhalt von `docs/nginx-link-headers.conf` einfügen

### Was bewusst NICHT gemacht wurde

- Keine Markdown-Endpunkte für Work / About / Photos — Pilot ist Blog. Wenn das Pattern passt, in Folge-Commit kopieren (gleiche Struktur, andere Daten-Funktion).
- Kein Echtzeit-Content-Negotiation (`Accept: text/markdown` → MD-Variante). isitagentready prüft das, aber mit `adapter-static` ist das nicht möglich. Workaround: Markdown unter eigener URL (`/<page>/llms.md`) plus `Link: rel="alternate"` Header — was wir machen.
- Kein neues Package — alle Konvertierungen mit bestehendem `node-html-parser`.

### Erwarteter Effekt auf isitagentready Score

| Check | Vorher | Nachher (erwartet) |
|---|---|---|
| robots.txt | ✅ | ✅ |
| sitemap.xml | ✅ | ✅ |
| Link headers (RFC 8288) | ❌ | ✅ (nach Nginx-Config) |
| Markdown for Agents | ❌ | ⚠ teilweise — `.md` URLs vorhanden + `Link: rel="alternate"`, aber kein echtes `Accept`-Negotiation |
| AI bot rules | ✅ | ✅ |
| Content Signals | ❌ | ✅ (nach Seomatic-Update) |

Score-Schätzung: 25 → ~70-85.

### Test-Schritte (lokal)

```bash
pnpm install
pnpm build
# erwartet: keine Errors, build/blog/<slug>/llms.md existiert für jeden Eintrag,
# build/llms.txt existiert
```

Stichproben:
- `build/llms.txt` sollte mit `# David Hellmann` starten und Blog-/Work-Listen enthalten
- `build/blog/<irgendein-slug>/llms.md` sollte YAML-Frontmatter + Markdown-Body haben
