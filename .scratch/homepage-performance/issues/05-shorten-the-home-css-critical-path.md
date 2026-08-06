# 05 — Shorten the home CSS critical path

**What to build:** Reduce the stylesheet request chain that blocks the homepage's first render, using measured, local changes rather than a broad CSS architecture rewrite.

**Blocked by:** 04 — Reduce the initial font budget.

**Status:** ready-for-agent

- [ ] The render-blocking stylesheet requests and their durations are captured after the font work lands.
- [ ] The homepage has fewer or faster render-blocking CSS requests without duplicating large amounts of CSS in the document.
- [ ] Shared navigation, typography, and route-specific styling remain intact on representative pages.
- [ ] The resulting FCP and LCP change is recorded with a mobile Lighthouse comparison.
