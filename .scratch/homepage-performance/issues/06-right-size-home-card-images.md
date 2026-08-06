# 06 — Right-size home card images

**What to build:** Make homepage Work and Photo cards request the closest existing responsive image candidate for their rendered size, reducing transferred bytes without lowering visible image quality.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Card sizing rules reflect their actual mobile and desktop layout widths.
- [ ] Page-visible cards use the existing responsive transform ladder and never load original assets before interaction.
- [ ] A Lighthouse comparison shows lower image transfer or removes the affected oversized-image findings.
- [ ] No new CMS transform family is introduced unless measurements prove the existing candidates cannot meet the requirement.
