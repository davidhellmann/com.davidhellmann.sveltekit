# 02 — Make image priority and hero preloading explicit

**What to build:** Give the shared image component independent lazy-loading, fetch-priority, and opt-in preload controls. Home and About heroes use the responsive preload, while other known first-viewport images retain explicit priority without being preloaded.

**Blocked by:** None — can start immediately.

**Status:** in-review

- [x] Preload defaults to off, fetch priority defaults to auto, and eager loading no longer implies high priority.
- [x] Home and About heroes preload the same responsive candidates and sizing rules used by their rendered images.
- [x] Known first-viewport listing and detail images retain explicit high priority without receiving a preload.
- [ ] The browser downloads each selected hero candidate only once.
- [ ] A mobile Lighthouse comparison records the hero resource-load delay before and after the change.
