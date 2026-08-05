# Ticket 08 pre-deploy performance verification

Date: 2026-08-05

## Public stage baseline

The inspected mobile PageSpeed run reported:

- Performance: 76
- FCP: 2.3 s
- LCP: 5.3 s
- Speed Index: 4.0 s
- TBT: 10 ms
- CLS: 0

The score is paint-bound. TTFB, TBT, and CLS are already healthy.

## Critical findings

- The only render-blocking request was the 14.9 KiB gzip global stylesheet, with an estimated 900 ms saving.
- The hero was the LCP element. Its breakdown included about 1.06 s of element render delay after the image request.
- Three native-lazy work images were fetched during the slow mobile run. They accounted for roughly 494 KiB and can compete with the hero request.
- The header avatar was the only image without explicit intrinsic dimensions.
- The reported 42 KiB of unused JavaScript was unscored, TBT was effectively zero, and the single long task was only 50 ms. JavaScript is not the current score limiter.

## Implemented for the next deploy

- Raised SvelteKit's `inlineStyleThreshold` from 5,000 to 100,000 bytes so the 91.05 KiB global CSS asset is inlined.
- Assigned `fetchpriority="low"` to homepage work and photo card images while preserving native lazy loading.
- Added the avatar's intrinsic `240 × 240` dimensions.

Local production response comparison:

| Resource path                    |     Before |     After |
| -------------------------------- | ---------: | --------: |
| HTML, raw                        |  363,346 B | 454,699 B |
| HTML, gzip                       |   89,910 B | 104,352 B |
| Separate global CSS, gzip        |   14,800 B |       0 B |
| Combined HTML + global CSS, gzip | ~104,710 B | 104,352 B |

The transfer size is effectively unchanged, but the separate render-blocking CSS round trip is removed.

## Local verification

- `npm run build`: passed
- `npm run check`: passed with the repository's existing CSS at-rule warnings
- `npm run test -- --run`: 59/59 passed
- `npm run lint`: still blocked by 59 pre-existing formatting violations outside this change; all changed files pass Prettier
- Mobile production-preview smoke checks: homepage, `/photos/`, and `/photos/21mm-2026-02-11` rendered correctly

## Post-deploy protocol

Run PageSpeed three times each against `https://stage.davidhellmann.com/`:

1. Mobile runs ×3
2. Desktop runs ×3
3. Record each score plus FCP, LCP, Speed Index, TBT, CLS, and TTFB
4. Use the median for acceptance: Mobile ≥90 and Desktop 100, with no run more than two points below target

If the median remains below 90, inspect the new LCP breakdown before changing anything else. The next meaningful trade-offs are the visually important home glass blur or dedicated cropped work-card assets; unused JavaScript is not the priority while TBT remains near zero.
