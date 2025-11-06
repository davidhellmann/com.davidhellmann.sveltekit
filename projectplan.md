# Project Plan: Fix `<svelte:body>` Class Binding

## Problem
The `<svelte:body class:is-home={isHome} class:is-photos={isPhotos} />` directive is not working properly in the +layout.svelte file. This is a known issue with Svelte 5's handling of conditional class directives on special elements.

## Solution Approach
Replace the `class:` directive with a reactive `$effect` that directly manipulates the document body's classList. This approach:
- Works reliably with Svelte 5's reactivity system
- Provides direct DOM manipulation for body classes
- Cleans up classes properly when values change

## Tasks

- [ ] Replace `<svelte:body>` directive with `$effect` for body class management
- [ ] Test that `is-home` class is applied on home page
- [ ] Test that `is-photos` class is applied on photos page
- [ ] Test that classes are properly removed when navigating between routes
- [ ] Verify background styling still works correctly

## Implementation Details

Replace the `<svelte:body>` line with a `$effect` that:
1. Adds/removes `is-home` class based on `isHome` reactive value
2. Adds/removes `is-photos` class based on `isPhotos` reactive value
3. Uses `document.body.classList` methods for direct manipulation
