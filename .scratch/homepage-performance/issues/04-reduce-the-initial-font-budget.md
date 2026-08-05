# 04 — Reduce the initial font budget

**What to build:** Keep the established Poppins, Bitter, JetBrains Mono, and Geomanist typography while preventing fonts that are not required for the initial homepage viewport from competing with its first paint.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] The initial homepage font requests and transfer size are measured before and after the change.
- [ ] Only fonts needed by visible first-viewport content are requested with initial-load priority.
- [ ] Existing Latin subsets and `font-display: swap` behavior are preserved.
- [ ] Typography remains visually unchanged across the homepage and representative content pages.
