## Destination

Find the route to consistent PageSpeed targets for the representative public templates: 100 Desktop and 90+ Mobile for home, listing pages, and one detail page each for work, blog, and photos.

The map is complete when the remaining implementation path is clear enough to execute without further discovery: target URLs are known, baseline scores and bottlenecks are captured, and the required performance strategy is chosen for images/LCP, fonts/CSS, JavaScript, third parties, and hosting/runtime constraints.

## Notes

- Domain: Core Web Vitals and PageSpeed/Lighthouse performance for the SvelteKit static site at `davidhellmann.com`.
- Consult `/audit-speed` for Core Web Vitals thresholds, root-cause trees, resource breakdown format, and priority-fix ordering.
- Representative scope confirmed by the user: home, listing pages, and one work detail, one blog detail, and one photos detail page.
- Treat the visual design and CMS content model as constraints unless a later decision explicitly trades them off.
- Prefer production-like measurements. If local measurements are used, record how they differ from public PageSpeed Insights.
- Use names when referring to tickets; local tracker paths are the links.

## Decisions so far

- [Establish the PageSpeed baseline](issues/01-establish-pagespeed-baseline.md) — Lighthouse lab baseline captured; only Blog detail meets the target, with LCP/image delivery as the dominant failure pattern and Photos listing/Home/Work detail as the biggest misses.
- [Select representative detail URLs](issues/02-select-representative-detail-urls.md) — Work detail uses `rb-leipzig`, Blog detail uses `tailwindcss-fluid-type-plugin`, and Photos detail uses `july-randoms-2026-07-06` as fixed comparison URLs.
- [Decide the measurement standard](issues/03-decide-measurement-standard.md) — Final success is PSI on public production URLs: 3 runs per URL/strategy, median must hit Desktop `100` and Mobile `>= 90`, with no run more than 2 points below target.
- [Identify shared bottleneck patterns](issues/04-identify-shared-bottleneck-patterns.md) — Main shared causes are lazy/oversized first-viewport images and delayed split-letter waypoint animations as LCP render delay, not layout shift; fonts/CSS and third-party scripts are secondary, while TTFB/CLS/TBT are guardrails.
- [Choose the image and LCP strategy](issues/05-choose-image-and-lcp-strategy.md) — Keep `Image.svelte` default-lazy and let templates opt known LCP candidates into eager/high priority with explicit `sizes`; page-visible images use the existing `200/400/800/1200/1800w` transform ladder, while originals are reserved for lightbox interaction.
- [Choose the font, CSS, and rendering strategy](issues/06-choose-font-css-and-rendering-strategy.md) — Preserve the blurred Waypoint reveal animations as a design constraint, keep font handling simple with `font-display: swap` and current subsets, remove only verified unused global font weight imports such as Poppins `300`, and avoid critical-CSS or font-preload work until image fixes are measured.
- [Choose the JavaScript and third-party strategy](issues/07-choose-javascript-and-third-party-strategy.md) — Keep broad hydration, animations, Cabin tracking, and speculation rules unchanged in the first pass; optimize only interaction-only cost such as LightGallery if it inflates initial bundles, because TBT is already low and analytics completeness should not be reduced speculatively.
- [Define performance guardrails](issues/08-define-performance-guardrails.md) — Use PSI 3-run medians on the 7 public URLs as the final release gate, keep local Lighthouse diagnostic rather than a brittle CI score gate, require `npm run check`, preserve CLS/TBT/TTFB guardrails, and review page-visible images for explicit priority, `sizes`, transform ceiling, and no pre-interaction originals.

## Not yet specified

- No further planning fog remains for the first implementation pass. The next step is implementation and measurement, not another Wayfinder decision.

## Out of scope

- Optimizing every archived/content URL individually. This map targets representative templates and reusable fixes.
- Broad redesign, CMS migration, or hosting migration unless measurements show one is necessary for the stated PageSpeed target.
