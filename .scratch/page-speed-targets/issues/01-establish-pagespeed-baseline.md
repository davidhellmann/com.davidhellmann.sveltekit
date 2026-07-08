Title: Establish the PageSpeed baseline
Type: research
Status: resolved
Blocked by:

## Question

What are the current PageSpeed/Lighthouse scores and Core Web Vitals bottlenecks for the representative template set: home, listing pages, and one detail page each for work, blog, and photos?

The answer should name the exact tested URLs, capture Desktop and Mobile scores, record LCP/CLS/INP/FCP/TTFB where available, and identify which templates miss the destination.

## Answer

Baseline captured in [PageSpeed Baseline](../assets/2026-07-08-pagespeed-baseline.md).

Measured with Lighthouse 13.4.0 against public production URLs on 2026-07-08. Google PageSpeed Insights API was unavailable without an API key because it returned quota `0/day`, so this is a Lighthouse lab baseline rather than the final PSI acceptance standard.

Only the selected blog detail page meets the destination in this baseline. Mobile misses are Home `71`, Blog listing `84`, Work listing `76`, Photos listing `57`, Work detail `78`, and Photos detail `86`. Desktop misses are Home `90`, Blog listing `97`, Work listing `99`, Photos listing `86`, Work detail `98`, and Photos detail `99`.

Initial bottleneck read: LCP/image delivery dominates; TTFB, CLS, and TBT are generally good. Work detail transfers about `44 MiB` of images. Photos listing has the worst mobile score and very slow FCP/LCP. Work detail and Photos detail show above-the-fold LCP images still lazy-loaded. Blog and Work listing also show animated text as LCP with element render delay, so image work alone may not get every template to the target.
