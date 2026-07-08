# Shared Bottleneck Patterns

Research for [Identify shared bottleneck patterns](../issues/04-identify-shared-bottleneck-patterns.md), based on the 2026-07-08 Lighthouse baseline and the SvelteKit code paths that render the measured templates.

## Executive Read

The main shared pattern is not JavaScript execution, server time, or CLS. The route to the target is mostly:

1. Make above-the-fold image priority explicit per template.
2. Reduce image bytes and candidate selection on image-heavy list/detail templates.
3. Stop first-viewport entrance animations from delaying LCP text/cards, without treating them as layout-shift problems.
4. Trim or defer shared font/third-party costs only after the first three areas are addressed.

TTFB, TBT, and CLS are already good in the baseline. Treat them as guardrails, not primary optimization targets.

## Shared Patterns

### 1. Shared image component defaults are correct for below-fold content but wrong for several first-viewport images

`src/lib/components/media/Image.svelte` defaults every image to:

- `loading="lazy"`
- `fetchPriority` only when `lazy={false}`
- `sizes="auto"` for lazy images
- `sizes="100vw"` only for eager images without an explicit `sizes`

That default is sensible for repeated image grids, but several templates put image cards or gallery images above the fold without overriding `lazy`.

Confirmed code paths:

- `src/lib/components/containers/GridBentoWork.svelte` renders work listing/card images with `<Image ... />` and no priority override.
- `src/lib/components/cards/Photos.svelte` renders home photo cards with `<Image ... />` and no priority override.
- `src/lib/components/stacks/Photos.svelte` renders photo listing preview images with `<Image ... />` and no priority override.
- `src/lib/components/modals/LightboxWork.svelte` renders all work detail gallery images with `<Image ... />` and no priority override.
- `src/lib/components/modals/LightboxPhotos.svelte` renders all photo detail gallery images with `<Image ... />` and no priority override.

This matches Lighthouse:

- Work detail LCP image is `loading="lazy"`.
- Photos detail LCP image is `loading="lazy"`.
- Photos listing LCP image is `loading="lazy"`.
- Home hero is already `lazy={false}`, so its issue is byte/candidate selection, not discovery.

### 2. Image bytes dominate the misses

Image transfer is the largest resource class on every failing media-heavy route:

| Template | Mobile image transfer | Desktop image transfer | Pattern |
| --- | ---: | ---: | --- |
| Home | 768 KiB | 910 KiB | Hero plus featured image cards. |
| Work listing | 1,788 KiB | 1,974 KiB | Bento cards load large CMS transforms. |
| Photos listing | 1,212 KiB | 1,572 KiB | Many preview thumbnails and first-viewport lazy LCP. |
| Work detail | 44,084 KiB | 43,345 KiB | Extreme gallery payload. |
| Photos detail | 1,951 KiB | 1,127 KiB | Gallery payload plus lazy LCP. |

The biggest template-specific outlier is Work detail: it transfers about `44 MiB`, almost entirely images. That is far beyond a normal page-weight issue and should be handled as a gallery loading/transform strategy problem, not a generic LCP tweak.

### 3. First-viewport waypoint animations delay text/card LCP without shifting layout

Listing pages use large split-letter headings:

- Blog listing: `src/routes/blog/[[page=page]]/+page.svelte`
- Work listing: `src/routes/work/+page.svelte`
- Photos listing: `src/routes/photos/[[page=page]]/+page.svelte`

They call `splitTextIntoDivs(...)`, then animate the letters via `useWaypoint` and `useJumpingLetters`.

The animation system sets first-viewport targets to hidden/transformed/blurred states until `data-waypoint-animated` is applied:

- `src/lib/actions/action.waypoint.ts` waits `50ms`, then IntersectionObserver, then a default `50ms` delay and `35ms` stagger.
- `src/lib/styles/animations.css` applies `opacity-0`, transforms, and for `is-blurInLeftDown`, `blur-3xl`.

This is not a CLS/layout-shift issue. The animations use transform/opacity/filter states and the baseline CLS is `0`. The issue is that Lighthouse can see the heading as the LCP element while it is still initially hidden/transformed/blurred and waiting for client-side waypoint timing.

This maps directly to Lighthouse LCP observations:

- Blog listing LCP is a split letter (`W`) with element render delay.
- Work listing LCP is the split-letter heading with element render delay.
- Photos listing desktop LCP is a split letter (`O`) with element render delay, though mobile LCP becomes an image.

The pattern is shared: text that is visually the primary content starts hidden/blurred and becomes visible only after client-side action timing.

### 4. Font payload is a shared secondary cost

Every measured template transfers about `153 KiB` of fonts:

- Poppins 300/400/500/700
- Bitter variable
- JetBrains Mono variable
- Geomanist Ultra
- Geomanist Medium

The code already uses latin-only subsets in `src/lib/styles/webfonts.css`, which is good. The remaining question is whether all families/weights need to be loaded on every route. This is not the first bottleneck for the largest misses, but it matters for Desktop `100` because Desktop scores are already near the threshold and shared font cost is present everywhere.

### 5. Render-blocking CSS is present but small

CSS transfer is low in the baseline: roughly `16-24 KiB` per route. Lighthouse still flags render-blocking requests on many pages, but estimated savings are small compared with image and animation issues. CSS should be handled under the font/CSS/rendering strategy, but it is not the lead bottleneck.

### 6. JavaScript execution is not currently the primary blocker

TBT is `0-40ms` across the baseline. JS transfer is moderate on most pages:

- Most routes: `76-93 KiB`
- Blog detail: `383 KiB`, likely from content/code related dependencies, but it still scores `97/100` mobile/desktop and meets the destination.

The JavaScript strategy ticket should focus on:

- whether first-viewport animations should run before LCP,
- whether lightbox/Embla/Shiki-like features are only loaded where needed,
- whether third-party analytics changes PSI variance.

It should not start from a broad "reduce all JS" assumption.

### 7. Third-party script impact is low in lab bytes, but still part of final PSI risk

`src/app.html` loads:

- speculation rules for conservative prerender
- `https://helge.davidhellmann.com/hello.js`

The Lighthouse home run saw `helge` transfer only small bytes, but it created script/XHR activity. Because final success is PSI on production URLs, third-party behavior can still affect variance and should be checked later. It is not a lead bottleneck from the current lab data.

### 8. TTFB and CLS are guardrails, not action areas

TTFB is well below the good threshold across the baseline. CLS is `0` across the measured pages. Any implementation should preserve this; neither metric currently explains the missed scores.

## Template-Specific Patterns

### Home

Home uses the right LCP discovery pattern for the hero image:

- `src/routes/+page.svelte` renders the hero image with `lazy={false}` and `noscript={false}`.
- `Image.svelte` therefore emits `loading="eager"` and `fetchpriority="high"`.

The miss is likely from image byte/candidate sizing and first-viewport composition, not a missing priority hint. It also loads featured Work/Photo cards below the hero area; those images may still affect total transfer and scoring.

### Blog listing

Blog listing is not image-heavy. Its mobile miss is LCP/FCP driven around the animated custom title. This is the cleanest proof that entrance animation strategy matters independently of images.

### Work listing

Work listing has both shared problems:

- animated split-letter title LCP,
- large lazy work-card images in `GridBentoWork`.

It needs image strategy plus rendering/animation strategy.

### Photos listing

Photos listing is the worst mobile result (`57`). It combines:

- many preview images,
- first-viewport image LCP still lazy-loaded,
- split-letter heading/waypoint animation,
- large total image transfer.

This is the highest-risk listing template.

### Blog detail

The selected Blog detail meets the target. It is useful as a control. It should not drive heavy optimization work, but it should be included in regression checks because its JS payload is higher than the other non-gallery pages.

### Work detail

Work detail is the largest outlier: about `44 MiB` transferred, mostly gallery images. Its first visible gallery image is lazy-loaded. The implementation strategy must address gallery loading and transform selection, not just set the first image eager.

### Photos detail

Photos detail has the same first-image lazy LCP issue as Work detail, but a much smaller payload. It is likely to improve substantially from first-image priority plus better gallery image sizing.

## Strategy Implications

### Highest leverage

- Image/LCP strategy:
  - distinguish first-viewport/LCP image from below-fold gallery images,
  - pass explicit `lazy={false}`, `sizes`, and possibly preload rules for first visible images,
  - reduce gallery payload, especially Work detail,
  - verify `srcset` transform widths match actual rendered sizes.

- Font/CSS/rendering strategy:
- remove or alter first-viewport waypoint hiding/blur for LCP text where that text is the measured LCP,
- avoid client-delayed reveal on above-the-fold headings where it delays LCP, while preserving transform-only animations where they do not affect LCP,
  - evaluate route-level font loading or fewer weights only after image/animation work.

### Lower leverage but still relevant

- JavaScript/third-party strategy:
  - keep TBT low,
  - avoid loading heavy optional UI modules before they are needed,
  - decide whether `helge` and speculation rules remain acceptable for PSI variance.

## Existing Tickets Are Sufficient

No new tickets are needed. The current strategy tickets map cleanly onto the patterns:

- [Choose the image and LCP strategy](../issues/05-choose-image-and-lcp-strategy.md)
- [Choose the font, CSS, and rendering strategy](../issues/06-choose-font-css-and-rendering-strategy.md)
- [Choose the JavaScript and third-party strategy](../issues/07-choose-javascript-and-third-party-strategy.md)

Those three can now run in parallel because this research separates the shared and template-specific causes clearly enough.
