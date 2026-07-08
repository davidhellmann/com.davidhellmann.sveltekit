Title: Choose the JavaScript and third-party strategy
Type: grilling
Status: resolved
Blocked by: 04

## Question

What JavaScript and third-party strategy should the implementation follow to meet the mobile target?

Decide how to treat client hydration, interaction scripts, animations/actions, LightGallery/Embla/Shiki usage, the analytics script from `helge.davidhellmann.com`, and the speculation rules in `src/app.html`.

## Answer

Do not start from broad JavaScript reduction. Baseline TBT is already low (`0-40ms`), so JavaScript is a guardrail and payload/variance area, not the primary bottleneck.

Client and interaction strategy:

- Preserve the existing animation actions and view transitions unless later measurements prove they are the remaining blocker. The blurred Waypoint reveal has already been accepted as a design constraint.
- Keep route hydration as-is in the first implementation pass. No island/partial-hydration architecture work is justified by the baseline.
- Move optional, interaction-only UI code later where it does not change behavior. The clear candidate is LightGallery: `action.lightbox.ts` currently imports `lightgallery`, plugins, and LightGallery CSS at module top level. Prefer loading LightGallery and its plugins only when the gallery is activated, or otherwise ensure it does not inflate the initial route bundle before interaction.
- Keep Shiki as-is unless build analysis shows it enters client bundles on non-code pages. The selected Blog detail already meets the target, so Shiki is not a lead optimization.
- Keep Embla as-is unless build analysis shows it is present on measured routes that do not use sliders.

Third-party strategy:

- Keep Cabin/withcabin tracking (`https://helge.davidhellmann.com/hello.js`) in its current direct `async defer` production path for the first pass. Delaying analytics until idle/load could miss short visits or otherwise reduce tracking completeness, and the user only accepts changes that do not restrict tracking.
- Treat Cabin as a PSI variance risk to measure, not a default removal/defer target. If all first-party fixes land and PSI still misses because of Cabin activity, revisit with an explicit tracking-versus-score tradeoff.
- Keep the existing speculation rules initially. They are conservative and not a measured lead bottleneck; revisit only if PSI/resource traces show unwanted prerender activity during tests.

Implementation priority:

1. Fix image priority, `sizes`, and gallery payload first.
2. Remove or defer interaction-only LightGallery cost if it shows up in the initial bundle or Lighthouse unused-JS findings.
3. Leave analytics and speculation rules unchanged unless final PSI runs isolate them as the remaining cause.
