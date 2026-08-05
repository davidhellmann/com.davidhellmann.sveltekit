# 02 — Preload the home hero

**What to build:** Make the responsive homepage hero discoverable from the document head so it begins loading as early as possible, while keeping it as the only high-priority image on the initial homepage viewport.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] The hero preload uses the same responsive candidates and sizing rules as the rendered hero image.
- [ ] The browser downloads the selected hero candidate only once.
- [ ] No below-the-fold homepage image is eager or high priority.
- [ ] A mobile Lighthouse comparison records the hero resource-load delay before and after the change.
