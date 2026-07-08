Title: Decide the measurement standard
Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

What measurement standard defines success for this effort?

Decide whether success is based on Google PageSpeed Insights for public URLs, local Lighthouse against production build/preview, or both. Also decide how many runs are required, which network/device profile counts, and how to handle normal Lighthouse variance near the thresholds.

## Answer

Success for this effort is defined by Google PageSpeed Insights on the public production URLs selected for the map:

- `https://davidhellmann.com/`
- `https://davidhellmann.com/blog`
- `https://davidhellmann.com/work`
- `https://davidhellmann.com/photos`
- `https://davidhellmann.com/work/rb-leipzig`
- `https://davidhellmann.com/blog/tailwindcss-fluid-type-plugin`
- `https://davidhellmann.com/photos/july-randoms-2026-07-06`

Targets:

- Desktop: `100`
- Mobile: `>= 90`

Run rule:

- Run PageSpeed Insights 3 times per URL and strategy.
- A URL/strategy passes when the median score meets the target and no individual run is more than 2 points below target.
- Local Lighthouse runs against public URLs or production preview are allowed for diagnosis and fast iteration, but they do not define final success.

This means local Lighthouse can guide implementation, but the final acceptance gate is PSI on production-like public URLs.
