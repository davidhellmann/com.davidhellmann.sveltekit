# PageSpeed Baseline

Measured on 2026-07-08 with Lighthouse 13.4.0 against public `https://davidhellmann.com` URLs.

Google PageSpeed Insights API could not be used from this environment: the unauthenticated API returned quota `0/day`. Treat this as a production-like Lighthouse lab baseline, not the final PSI acceptance standard.

## Tested URLs

| Template | URL | Why this URL |
| --- | --- | --- |
| Home | `https://davidhellmann.com/` | Public home template with large hero image and featured content. |
| Blog listing | `https://davidhellmann.com/blog` | Main blog list template. |
| Work listing | `https://davidhellmann.com/work` | Main work list template with image-heavy cards. |
| Photos listing | `https://davidhellmann.com/photos` | Main photos list template with many thumbnails. |
| Blog detail | `https://davidhellmann.com/blog/tailwindcss-fluid-type-plugin` | Representative post with media and normal article layout. |
| Work detail | `https://davidhellmann.com/work/rb-leipzig` | Image-heavy work detail; intentionally tests the upper bound of the template. |
| Photos detail | `https://davidhellmann.com/photos/july-randoms-2026-07-06` | Recent photo gallery with many images. |

## Scores

| Page | Mobile | Desktop | Target status |
| --- | ---: | ---: | --- |
| Home | 71 | 90 | Misses both targets. |
| Blog listing | 84 | 97 | Misses both targets. |
| Work listing | 76 | 99 | Misses both targets. |
| Photos listing | 57 | 86 | Misses both targets. |
| Blog detail | 97 | 100 | Meets both targets. |
| Work detail | 78 | 98 | Misses both targets. |
| Photos detail | 86 | 99 | Misses both targets. |

## Core Lab Metrics

| Page | Mode | FCP | LCP | TBT | CLS | Speed Index | TTFB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | Mobile | 3.3 s | 5.6 s | 0 ms | 0 | 4.1 s | 80 ms |
| Home | Desktop | 0.7 s | 1.7 s | 0 ms | 0 | 1.7 s | 60 ms |
| Blog listing | Mobile | 2.5 s | 4.0 s | 10 ms | 0 | 2.5 s | 40 ms |
| Blog listing | Desktop | 0.6 s | 0.9 s | 0 ms | 0 | 1.5 s | 40 ms |
| Work listing | Mobile | 2.7 s | 5.0 s | 0 ms | 0 | 3.8 s | 40 ms |
| Work listing | Desktop | 0.6 s | 0.7 s | 0 ms | 0 | 0.7 s | 30 ms |
| Photos listing | Mobile | 8.0 s | 10.1 s | 20 ms | 0 | 8.0 s | 30 ms |
| Photos listing | Desktop | 1.4 s | 1.8 s | 0 ms | 0 | 1.5 s | 60 ms |
| Blog detail | Mobile | 1.3 s | 2.6 s | 40 ms | 0 | 1.9 s | 70 ms |
| Blog detail | Desktop | 0.5 s | 0.7 s | 0 ms | 0 | 0.7 s | 40 ms |
| Work detail | Mobile | 2.4 s | 5.0 s | 0 ms | 0 | 3.3 s | 140 ms |
| Work detail | Desktop | 0.5 s | 1.2 s | 0 ms | 0 | 0.6 s | 40 ms |
| Photos detail | Mobile | 1.6 s | 4.1 s | 0 ms | 0 | 1.7 s | 30 ms |
| Photos detail | Desktop | 0.4 s | 0.8 s | 0 ms | 0 | 0.7 s | 70 ms |

## Resource Weight

| Page | Mode | Total | Images | Fonts | JS | CSS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Home | Mobile | 1,371 KiB | 768 KiB | 153 KiB | 84 KiB | 16 KiB |
| Home | Desktop | 1,512 KiB | 910 KiB | 153 KiB | 84 KiB | 16 KiB |
| Blog listing | Mobile | 474 KiB | 25 KiB | 153 KiB | 79 KiB | 16 KiB |
| Blog listing | Desktop | 474 KiB | 25 KiB | 153 KiB | 79 KiB | 16 KiB |
| Work listing | Mobile | 2,310 KiB | 1,788 KiB | 153 KiB | 76 KiB | 16 KiB |
| Work listing | Desktop | 2,496 KiB | 1,974 KiB | 153 KiB | 76 KiB | 16 KiB |
| Photos listing | Mobile | 2,792 KiB | 1,212 KiB | 153 KiB | 81 KiB | 16 KiB |
| Photos listing | Desktop | 3,152 KiB | 1,572 KiB | 153 KiB | 81 KiB | 16 KiB |
| Blog detail | Mobile | 607 KiB | 30 KiB | 153 KiB | 383 KiB | 24 KiB |
| Blog detail | Desktop | 608 KiB | 31 KiB | 153 KiB | 383 KiB | 24 KiB |
| Work detail | Mobile | 44,435 KiB | 44,084 KiB | 153 KiB | 93 KiB | 24 KiB |
| Work detail | Desktop | 43,695 KiB | 43,345 KiB | 153 KiB | 93 KiB | 24 KiB |
| Photos detail | Mobile | 2,264 KiB | 1,951 KiB | 153 KiB | 93 KiB | 22 KiB |
| Photos detail | Desktop | 1,439 KiB | 1,127 KiB | 153 KiB | 93 KiB | 22 KiB |

## Initial Bottleneck Read

- LCP is the main failing metric. CLS and TBT are already good in these Lighthouse runs.
- TTFB is good across the measured set, so this does not initially look like a hosting/server-response problem.
- Images dominate the misses:
  - Home image delivery has estimated savings around 624 KiB on mobile.
  - Work listing image delivery has estimated savings around 1,493 KiB on mobile.
  - Photos listing has very slow mobile FCP/LCP and large image payload.
  - Work detail is extreme: about 44 MiB transferred, almost entirely images.
  - Photos detail has an above-the-fold LCP image still marked `loading="lazy"`.
  - Work detail has its first LCP image still marked `loading="lazy"`.
- Several list pages use animated text as LCP. Blog listing and Work listing both show LCP element render delay, so the animation/rendering path needs investigation in addition to images.
- Font payload is consistent at about 153 KiB across every page. It is not the largest problem, but it is a shared cost that can matter for the 100 Desktop target.
- Lighthouse repeatedly flags missing explicit image dimensions despite the shared image component outputting `width` and `height` on CMS images. This may be from secondary/no-script images, SVGs, or transformed markup and needs inspection before assuming the component is enough.
- `helge.davidhellmann.com` loads on the home run, but transferred bytes are small. Third-party impact should still be checked because PSI/field data may weigh it differently than this lab run.

## Pages Missing Destination

- Mobile below 90: Home, Blog listing, Work listing, Photos listing, Work detail, Photos detail.
- Desktop below 100: Home, Blog listing, Work listing, Photos listing, Work detail, Photos detail.
- Meets destination in this baseline: Blog detail only.

## Next Decisions This Unlocks

- `Identify shared bottleneck patterns` should separate shared fixes from template-specific fixes.
- `Choose the image and LCP strategy` is likely the highest-impact decision.
- `Choose the font, CSS, and rendering strategy` should include the animated-text LCP path and the fixed 153 KiB font cost.
- `Choose the JavaScript and third-party strategy` is lower priority from this baseline, but still relevant for final PSI variance and the Desktop 100 target.
