Title: Identify shared bottleneck patterns
Type: research
Status: resolved
Blocked by: 01, 02

## Question

Which bottlenecks are shared across templates, and which are template-specific?

Analyze the baseline by resource class and metric: LCP element, image delivery, font loading, render-blocking CSS, JavaScript execution, third-party scripts, speculation rules, TTFB, and layout stability. The answer should separate high-leverage shared fixes from isolated page fixes.

## Answer

Research captured in [Shared Bottleneck Patterns](../assets/2026-07-08-bottleneck-patterns.md).

The shared bottlenecks are image priority/bytes and first-viewport rendering animations. `Image.svelte` defaults to lazy loading, which is right for repeated grids but currently applies to first-visible work/photos listing and gallery images. Work detail and Photos detail both show lazy-loaded LCP images. Work detail is the extreme payload outlier at roughly `44 MiB` transferred, mostly gallery images.

The second shared pattern is animated split-letter headings. Blog listing, Work listing, and Photos listing render first-viewport titles through `splitTextIntoDivs`, `useWaypoint`, and `useJumpingLetters`; the CSS starts those letters hidden/transformed/blurred until client-side waypoint timing marks them animated. This is not a layout-shift problem, and CLS is `0`; Lighthouse identifies those split letters as LCP on several listing pages, so the concern is render delay for the LCP element.

Secondary shared costs: fonts are a fixed `~153 KiB` on every measured route; CSS is small but render-blocking; `helge.davidhellmann.com` and speculation rules are not leading byte costs but remain PSI variance risks. TTFB, CLS, and TBT are already good and should be treated as guardrails.

No new tickets are needed. The existing image/LCP, font/CSS/rendering, and JavaScript/third-party strategy tickets now map cleanly to the discovered patterns.
