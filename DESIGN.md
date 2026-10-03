# Design conventions

A guide to the existing UI, not a redesign brief. The components and CSS are the source of truth; do not duplicate their token values here.

## Preserve the existing visual language

- Reuse the site's expressive typography, fluid spacing, image-led layouts, and existing decorative components rather than introducing a separate UI kit.
- Match the surrounding section: page backgrounds and light/dark treatments differ between home, blog, photos, work, and about. Check the relevant route layout before changing them.
- Reuse existing cards, heroes, text primitives, and media components before creating new variants.

## Typography and tokens

- `src/lib/styles/app.css` is the stylesheet entry point.
- `src/lib/styles/theme/` defines colors, spacing, breakpoints, typography, and transitions. Prefer those tokens over new hard-coded values.
- Font families: Poppins (`sans`), Bitter Variable (`serif`), JetBrains Mono Variable (`mono`), Geomanist (`decorative`). Loading is configured in `src/routes/+layout.svelte` and `src/lib/styles/webfonts.css`.
- Typography uses fluid sizes. `src/lib/components/text/Headline.svelte` separates semantic heading `tag` from visual `preset` and `family`; preserve correct heading order independently of appearance.

## Layout and components

- `src/lib/styles/components/fluid-grid.css`: responsive 12-column grid, named lines, and `span-*` utilities. Reuse these for page alignment.
- `src/lib/styles/utilities/stacks.css`: `stack-*` vertical spacing and per-item overrides.
- `src/lib/styles/variants/themes.css`: `theme-dark` responds to `data-theme="dark"`.
- `src/lib/utils/classNames.ts`: shared `cn`/`tv` helpers; follow nearby component variant patterns.
- `src/lib/components/media/Image.svelte`: shared image handling. Preserve responsive sources, dimensions/aspect ratios, and intentional loading priority.
- Use relative asset paths in CSS; do not use the removed `$lib` alias for fonts or backgrounds.

## UI verification

For visual changes, check narrow and wide viewports plus the affected section's theme. Verify readable text, heading order, image cropping, keyboard focus, and overflow. Preserve reduced-motion support when changing animation; do not make essential content depend on animation completing.

Typechecks and builds do not prove visual correctness. State explicitly when browser verification was not performed.
