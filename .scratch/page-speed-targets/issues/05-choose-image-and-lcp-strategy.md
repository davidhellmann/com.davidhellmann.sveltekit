Title: Choose the image and LCP strategy
Type: grilling
Status: resolved
Blocked by: 04

## Question

What image and LCP strategy should the implementation follow to reach the target without degrading the site's visual quality?

Decide the reusable rules for hero/LCP images, `loading`, `fetchpriority`, `sizes`, preloading, responsive source selection, blur placeholders, gallery images, and any CMS transform requirements.

## Answer

Use a caller-owned priority model, not a generic "first image wins" rule in `Image.svelte`.

Keep `Image.svelte` conservative by default: images stay lazy unless the template explicitly marks a known first-viewport/LCP candidate as eager. The component should continue to set `fetchpriority="high"` only when `lazy={false}` is passed. Template components own `sizes`, because only they know layout width.

Priority rules:

- Home hero: keep eager/high priority and give it an explicit hero `sizes` value.
- Work listing bento: mark only the first one or two first-viewport cards eager/high, depending on their layout slot.
- Photos listing: mark only the first entry's first preview image eager/high initially. Width/height already reserve layout height; priority is for LCP completion and bandwidth, not CLS. Expand to the first two preview images only if measurement shows the second preview becomes LCP.
- Work detail gallery: mark only the first visible gallery image eager/high; all remaining gallery images stay lazy.
- Photos detail masonry: mark only the first visible photo eager/high; all remaining photos stay lazy.
- Home featured cards: keep lazy unless a post-hero measurement proves one becomes LCP.

Responsive selection rules:

- Use the existing CMS transform ladder as the page-image ceiling: `200w`, `400w`, `800w`, `1200w`, `1800w`.
- Page-visible images should not request original/full-size assets. They may scale from `1800w` where needed.
- Original/full-size image URLs are acceptable only after user interaction in the lightbox.
- Do not add a new transform family yet. First win with correct `sizes`, sparse priority, and avoiding initial lightbox/original downloads.
- If measurements still show oversized image transfer after these changes, check for `src={image.url}`, lightbox preloads, or incorrect `sizes` before adding more CMS transforms.

Initial `sizes` targets:

- Home hero: `(min-width: 2000px) 1800px, (min-width: 1024px) calc(100vw - 4vw), 100vw`
- Work bento large card: `(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw`
- Work bento normal card: `(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw`
- Photos listing preview: `(min-width: 1024px) 25vw, 100vw`, adjusted down if the actual preview column is narrower.
- Work detail gallery: `(min-width: 1024px) 50vw, 100vw`
- Photos detail masonry: `(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw`

No separate blur-placeholder strategy is part of the first pass. The measured failures are LCP image completion and bytes, while CLS is already stable.
