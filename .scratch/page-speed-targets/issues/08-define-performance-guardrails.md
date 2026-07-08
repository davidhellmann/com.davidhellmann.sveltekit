Title: Define performance guardrails
Type: grilling
Status: resolved
Blocked by: 03, 04, 05, 06, 07

## Question

What guardrails should keep the site from regressing after the PageSpeed work lands?

Decide whether to add Lighthouse CI, bundle/resource budgets, image-size checks, manual release checks, or documentation only. The answer should account for this static SvelteKit/CMS setup and avoid brittle automation where scores naturally vary.

## Answer

Use layered guardrails. Do not make raw Lighthouse/PageSpeed scores a brittle CI failure gate, because the final target is PSI on public production URLs and scores vary with network, third-party timing, and CMS content.

Final acceptance guardrail:

- Keep the already-decided PSI standard as the release gate for this performance effort: run PageSpeed Insights against the 7 representative public URLs, 3 runs per URL/strategy, with median Desktop `100` and Mobile `>= 90`, and no single run more than 2 points below target.
- Store the final run table in `.scratch/page-speed-targets/assets/` so future work has a comparable reference.
- If PSI API quota remains unavailable, use manual PSI UI runs for final acceptance and local Lighthouse only for debugging.

Local implementation guardrails:

- Keep `npm run check` as the required correctness gate after code changes.
- Run local Lighthouse against the representative routes during performance iterations, but treat it as diagnostic rather than pass/fail truth.
- Compare the same 7 templates before and after implementation, with special attention to LCP, transferred image bytes, TBT, CLS, and resource counts.
- Preserve these metric guardrails from the baseline:
  - CLS should remain effectively `0`.
  - TBT should remain low; any route moving materially above the current `0-40ms` band needs investigation.
  - TTFB should remain good; do not hide CDN/hosting regressions behind image improvements.

Image-specific guardrails:

- Page-visible images should use the existing `200/400/800/1200/1800w` transform ladder and should not request original/full-size URLs before user interaction.
- First-viewport/LCP image priority must be explicit in the template; do not rely on a global first-image heuristic.
- Add code review checks for:
  - missing explicit `sizes` on known first-viewport image components,
  - accidental `image.url` use for page-visible gallery thumbnails/cards,
  - more than the intended sparse set of eager/high-priority images per template,
  - Lightbox original/full-size URLs being loaded before interaction.

Automation strategy:

- Do not add Lighthouse CI as a hard score gate in the first implementation pass.
- If automation is added, prefer a lightweight npm script that runs local Lighthouse and writes reports/artifacts for comparison, not a blocking score threshold.
- Avoid CI budgets that encode today's CMS content too tightly. Use resource budgets as warnings/docs first; convert to blocking only after several production runs show stable ranges.

Documentation guardrail:

- After implementation, document the chosen `Image.svelte` calling rules near the component or in a short performance note so future cards/galleries know when to pass `lazy={false}`, `sizes`, and when originals are allowed.

Implementation order:

1. Implement image/LCP strategy first: explicit priority, explicit `sizes`, transform ceiling, and gallery payload fixes.
2. Remove verified unused Poppins `300` if it remains unused after code review.
3. Check whether LightGallery inflates initial bundles; defer it only if build/Lighthouse evidence supports it.
4. Re-run local Lighthouse on the 7 templates.
5. Deploy or test on production-equivalent public URLs.
6. Run final PSI acceptance using the 3-run median/no-run-below rule.
