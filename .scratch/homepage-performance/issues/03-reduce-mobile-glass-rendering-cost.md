# 03 — Reduce mobile glass rendering cost

**What to build:** Preserve the homepage's glass aesthetic while preventing large backdrop effects from materially delaying the mobile hero paint. The existing split-letter and Waypoint reveal design remains unchanged.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] A mobile before/after trace isolates the rendering cost of the full-viewport and hero glass effects.
- [ ] Mobile uses the least expensive treatment that produces a material render-delay improvement and remains visually acceptable.
- [ ] Desktop retains the intended glass appearance.
- [ ] CLS and the existing reveal animations do not regress.
