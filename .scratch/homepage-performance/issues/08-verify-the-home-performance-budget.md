# 08 — Verify the home performance budget

**What to build:** Verify the completed homepage work against the established public PageSpeed standard and capture a comparable final result, addressing only remaining critical-path findings that genuinely prevent the target.

**Blocked by:** 01 — Preserve photo archive projections; 02 — Preload the home hero; 03 — Reduce mobile glass rendering cost; 04 — Reduce the initial font budget; 05 — Shorten the home CSS critical path; 06 — Right-size home card images; 07 — Stabilize the header home link.

**Status:** ready-for-agent

- [ ] Project checks pass and the homepage, photo archive, and a photo detail page receive focused regression checks.
- [ ] PageSpeed is run three times for Mobile and Desktop against the public homepage.
- [ ] The median reaches Mobile 90 or better and Desktop 100, with no run more than two points below its target.
- [ ] CLS remains effectively zero, TBT remains low, and no TTFB regression is hidden by frontend improvements.
- [ ] The final metrics and resource comparison are stored alongside the existing PageSpeed baseline artifacts.
