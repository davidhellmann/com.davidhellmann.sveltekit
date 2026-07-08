Title: Choose the font, CSS, and rendering strategy
Type: grilling
Status: resolved
Blocked by: 04

## Question

What font, CSS, and rendering strategy should the implementation follow to remove render-blocking cost while preserving the intended typography and layout?

Decide whether to change font display/preload behavior, subset or remove weights, alter critical CSS delivery, adjust route-level styles, or add layout reservations for above-the-fold elements.

## Answer

Preserve the existing Waypoint and blur reveal look. The visual impact of the blurred split-letter/waypoint animations is a product/design constraint, so the first implementation pass must not remove, bypass, or visibly weaken those animations just to improve Lighthouse LCP timing.

Rendering strategy:

- Keep the existing transform/opacity/filter-based animation system. The baseline CLS is `0`, so the animation issue is LCP render timing, not layout shift.
- Do not change first-viewport headings to always-visible/static content in the first pass.
- Treat the above-the-fold blur reveal as a known PageSpeed risk after image fixes. If PSI still misses after the image/LCP and payload changes, revisit this as an explicit design/performance tradeoff instead of hiding it inside the font/CSS work.
- Keep layout reservations as-is unless implementation work discovers an actual unsized element. The current concern is not shifting layout.

Font strategy:

- Keep `font-display: swap`.
- Keep the current Latin-only subsets for Bitter and JetBrains Mono.
- Keep Geomanist because it is central to the decorative heading/navigation look.
- Avoid route-level font loading or complex font orchestration in the first pass. The font payload is secondary compared with image payload and LCP priority.
- Remove obviously unused global font imports where verified locally. The clear candidate is Poppins `300`, because current class usage shows `font-medium`, `font-bold`, `font-extrabold`, and default/normal, but no `font-light`.
- Do not add font preloads yet. They can compete with LCP images on the image-heavy routes; only add them if later measurement shows font loading, not image loading, is the remaining bottleneck.

CSS strategy:

- Do not attempt critical-CSS splitting in the first pass. Baseline CSS transfer is small, and Tailwind/SvelteKit bundling is not the primary failure pattern.
- Keep CSS changes scoped to removing unused imports or fixing a concrete Lighthouse finding.
- Re-test after image work before spending effort on CSS architecture.
