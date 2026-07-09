# Lighthouse After Image/LCP Pass

Measured on 2026-07-09T05:03:10.156Z with Lighthouse 13.4.0 against public production URLs.

Google PageSpeed Insights API was unavailable without an API key again: unauthenticated API quota is `0/day`. This report therefore uses the same Lighthouse lab method as the 2026-07-08 baseline, not the final PSI acceptance gate.

Run rule used here: 3 runs per URL and strategy. The shown score is the median run. Target status follows the map rule: Desktop `100`, Mobile `>= 90`, and no individual run more than 2 points below target.

## Score Comparison

| Page | Mode | Baseline | Runs | Median | Delta | Target | Status |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| Home | mobile | 71 | 76, 76, 76 | 76 | +5 | 90 | Miss |
| Home | desktop | 90 | 86, 86, 85 | 86 | -4 | 100 | Miss |
| Blog listing | mobile | 84 | 86, 87, 85 | 86 | +2 | 90 | Miss |
| Blog listing | desktop | 97 | 99, 99, 99 | 99 | +2 | 100 | Miss |
| Work listing | mobile | 76 | 85, 87, 88 | 87 | +11 | 90 | Miss |
| Work listing | desktop | 99 | 99, 100, 99 | 99 | 0 | 100 | Miss |
| Photos listing | mobile | 57 | 57, 57, 57 | 57 | 0 | 90 | Miss |
| Photos listing | desktop | 86 | 83, 82, 83 | 83 | -3 | 100 | Miss |
| Blog detail | mobile | 97 | 95, 97, 80 | 95 | -2 | 90 | Miss |
| Blog detail | desktop | 100 | 100, 99, 100 | 100 | 0 | 100 | Pass |
| Work detail | mobile | 78 | 87, 86, 91 | 87 | +9 | 90 | Miss |
| Work detail | desktop | 98 | 98, 99, 99 | 99 | +1 | 100 | Miss |
| Photos detail | mobile | 86 | 88, 88, 87 | 88 | +2 | 90 | Miss |
| Photos detail | desktop | 99 | 98, 98, 97 | 98 | -1 | 100 | Miss |

## Median Lab Metrics

| Page | Mode | FCP | LCP | TBT | CLS | Speed Index | TTFB | Total bytes | Image bytes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | mobile | 2.9 s | 5.1 s | 9 ms | 0.000 | 2.9 s | 35 ms | 1,789 KiB | 1,272 KiB |
| Home | desktop | 0.6 s | 2.5 s | 0 ms | 0.000 | 0.8 s | 32 ms | 2,490 KiB | 1,974 KiB |
| Blog listing | mobile | 2.5 s | 3.7 s | 0 ms | 0.000 | 2.5 s | 37 ms | 466 KiB | 25 KiB |
| Blog listing | desktop | 0.5 s | 0.8 s | 0 ms | 0.000 | 0.7 s | 35 ms | 466 KiB | 25 KiB |
| Work listing | mobile | 2.7 s | 3.5 s | 0 ms | 0.000 | 2.7 s | 36 ms | 2,303 KiB | 1,788 KiB |
| Work listing | desktop | 0.6 s | 0.8 s | 0 ms | 0.000 | 0.8 s | 36 ms | 4,824 KiB | 4,309 KiB |
| Photos listing | mobile | 7.8 s | 19.3 s | 22 ms | 0.000 | 7.8 s | 35 ms | 10,637 KiB | 9,068 KiB |
| Photos listing | desktop | 1.4 s | 2.3 s | 0 ms | 0.000 | 1.4 s | 36 ms | 5,427 KiB | 3,858 KiB |
| Blog detail | mobile | 1.5 s | 2.8 s | 43 ms | 0.000 | 1.8 s | 35 ms | 599 KiB | 30 KiB |
| Blog detail | desktop | 0.4 s | 0.5 s | 0 ms | 0.000 | 0.6 s | 34 ms | 600 KiB | 31 KiB |
| Work detail | mobile | 1.9 s | 3.9 s | 0 ms | 0.000 | 1.9 s | 32 ms | 48,588 KiB | 48,245 KiB |
| Work detail | desktop | 0.4 s | 0.9 s | 0 ms | 0.000 | 0.5 s | 34 ms | 44,686 KiB | 44,343 KiB |
| Photos detail | mobile | 1.3 s | 3.8 s | 0 ms | 0.000 | 1.7 s | 112 ms | 2,256 KiB | 1,951 KiB |
| Photos detail | desktop | 0.4 s | 1.1 s | 0 ms | 0.000 | 0.6 s | 34 ms | 1,431 KiB | 1,127 KiB |

## Tested URLs

- Home: `https://davidhellmann.com/`
- Blog listing: `https://davidhellmann.com/blog`
- Work listing: `https://davidhellmann.com/work`
- Photos listing: `https://davidhellmann.com/photos`
- Blog detail: `https://davidhellmann.com/blog/tailwindcss-fluid-type-plugin`
- Work detail: `https://davidhellmann.com/work/rb-leipzig`
- Photos detail: `https://davidhellmann.com/photos/july-randoms-2026-07-06`

## Raw Reports

- Home mobile run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/home-mobile-1.json`
- Home mobile run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/home-mobile-2.json`
- Home mobile run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/home-mobile-3.json`
- Home desktop run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/home-desktop-1.json`
- Home desktop run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/home-desktop-2.json`
- Home desktop run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/home-desktop-3.json`
- Blog listing mobile run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-listing-mobile-1.json`
- Blog listing mobile run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-listing-mobile-2.json`
- Blog listing mobile run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-listing-mobile-3.json`
- Blog listing desktop run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-listing-desktop-1.json`
- Blog listing desktop run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-listing-desktop-2.json`
- Blog listing desktop run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-listing-desktop-3.json`
- Work listing mobile run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-listing-mobile-1.json`
- Work listing mobile run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-listing-mobile-2.json`
- Work listing mobile run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-listing-mobile-3.json`
- Work listing desktop run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-listing-desktop-1.json`
- Work listing desktop run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-listing-desktop-2.json`
- Work listing desktop run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-listing-desktop-3.json`
- Photos listing mobile run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-listing-mobile-1.json`
- Photos listing mobile run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-listing-mobile-2.json`
- Photos listing mobile run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-listing-mobile-3.json`
- Photos listing desktop run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-listing-desktop-1.json`
- Photos listing desktop run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-listing-desktop-2.json`
- Photos listing desktop run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-listing-desktop-3.json`
- Blog detail mobile run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-detail-mobile-1.json`
- Blog detail mobile run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-detail-mobile-2.json`
- Blog detail mobile run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-detail-mobile-3.json`
- Blog detail desktop run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-detail-desktop-1.json`
- Blog detail desktop run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-detail-desktop-2.json`
- Blog detail desktop run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/blog-detail-desktop-3.json`
- Work detail mobile run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-detail-mobile-1.json`
- Work detail mobile run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-detail-mobile-2.json`
- Work detail mobile run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-detail-mobile-3.json`
- Work detail desktop run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-detail-desktop-1.json`
- Work detail desktop run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-detail-desktop-2.json`
- Work detail desktop run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/work-detail-desktop-3.json`
- Photos detail mobile run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-detail-mobile-1.json`
- Photos detail mobile run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-detail-mobile-2.json`
- Photos detail mobile run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-detail-mobile-3.json`
- Photos detail desktop run 1: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-detail-desktop-1.json`
- Photos detail desktop run 2: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-detail-desktop-2.json`
- Photos detail desktop run 3: `.scratch/page-speed-targets/assets/2026-07-09-lighthouse-after-image-pass/raw/photos-detail-desktop-3.json`
