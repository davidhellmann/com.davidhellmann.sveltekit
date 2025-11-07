# Project Plan: Fix Blurhash Display Logic

## Problem
Currently, the blurhash is only displayed when `lazy=true`. However, the blurhash should be displayed whenever `srcset` is present, regardless of the lazy loading setting.

## Current Logic
```svelte
src={lazy && blurhash ? blurhash : src}
```

## Desired Logic
```svelte
src={srcset && blurhash ? blurhash : src}
```

## Tasks
- [ ] Update the `src` attribute logic in `Image.svelte` to show blurhash when `srcset` is present

## Changes
This ensures that:
- When `srcset` is available AND `blurhash` exists → show blurhash as placeholder
- Otherwise → show the regular `src`
- The actual image will load via `srcset` (either lazy or eager)

## Review
_Will be filled after implementation_
