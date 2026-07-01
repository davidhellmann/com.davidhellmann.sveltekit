# Photos Post Date Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a photo entry's `postDate` below the camera metadata in the photos stack, matching the blog date presentation.

**Architecture:** Reuse the existing `Time` text component in `Photos.svelte` instead of adding date formatting logic. The photos entry type already includes `Entry_DatesFragment`, so the implementation is a local component change plus a focused regression test.

**Tech Stack:** Svelte 5, SvelteKit, TypeScript, Vitest, existing `$components` and `$utils` aliases.

## Global Constraints

- Keep changes local to the photos stack and its focused test.
- Use `$components/text/Time.svelte` for date rendering so formatting matches blog cards.
- Do not change GraphQL queries, generated GraphQL types, routing, or pagination behavior.
- If `entry.postDate` is missing, render no date.

---

## File Structure

- Modify `src/lib/components/stacks/Photos.svelte`: import `Time` and render it below the camera metadata when `entry.postDate` exists.
- Create `src/lib/components/stacks/Photos.test.ts`: a focused source-level regression test that verifies the photos stack imports `Time`, gates rendering on `entry.postDate`, and passes `entry.postDate` to `Time`.

### Task 1: Add Post Date Rendering to Photos Stack

**Files:**

- Create: `src/lib/components/stacks/Photos.test.ts`
- Modify: `src/lib/components/stacks/Photos.svelte`

**Interfaces:**

- Consumes: `Time` component from `$components/text/Time.svelte`, accepting `timestamp?: unknown`.
- Consumes: `entry.postDate` from the existing `Entry_DatesFragment` in the local `Entry` type.
- Produces: Photos stack markup that includes `<Time timestamp={entry?.postDate} />` below camera metadata only when `entry?.postDate` exists.

- [ ] **Step 1: Write the failing regression test**

Create `src/lib/components/stacks/Photos.test.ts` with this content:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));
const photosComponentPath = resolve(currentDir, "Photos.svelte");

const readPhotosComponent = () => readFileSync(photosComponentPath, "utf8");

describe("Photos stack post date", () => {
  it("renders entry.postDate with the shared Time component", () => {
    const source = readPhotosComponent();

    expect(source).toContain('import Time from "$components/text/Time.svelte";');
    expect(source).toContain("{#if entry?.postDate}");
    expect(source).toContain("<Time timestamp={entry?.postDate} />");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm run test -- src/lib/components/stacks/Photos.test.ts --run
```

Expected: FAIL. The failure should include at least one assertion showing the missing `Time` import or missing `<Time timestamp={entry?.postDate} />` usage.

- [ ] **Step 3: Import the shared Time component**

In `src/lib/components/stacks/Photos.svelte`, add this import after the existing `Headline` import:

```svelte
import Time from "$components/text/Time.svelte";
```

The import block should become:

```svelte
import Pagination from "$components/navigation/Pagination.svelte"; import CardPhotos from
"$components/cards/Photos.svelte"; import Image from "$components/media/Image.svelte"; import Headline from
"$components/text/Headline.svelte"; import Time from "$components/text/Time.svelte"; import {getExifData} from "$utils/getExifData";
```

- [ ] **Step 4: Render the post date below the camera metadata**

In `src/lib/components/stacks/Photos.svelte`, replace this block:

```svelte
{#if exifDataParsed.cameras || exifDataParsed.lenses}
  <div class="flex flex-col gap-2">
    {#if exifDataParsed.cameras}
      <ul class={slotGearList()}>
        {#each exifDataParsed.cameras as camera}
          <li>{camera}</li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}
```

with this block:

```svelte
{#if exifDataParsed.cameras || exifDataParsed.lenses || entry?.postDate}
  <div class="flex flex-col gap-2">
    {#if exifDataParsed.cameras}
      <ul class={slotGearList()}>
        {#each exifDataParsed.cameras as camera}
          <li>{camera}</li>
        {/each}
      </ul>
    {/if}

    {#if entry?.postDate}
      <Time timestamp={entry?.postDate} />
    {/if}
  </div>
{/if}
```

- [ ] **Step 5: Run the focused test to verify it passes**

Run:

```bash
npm run test -- src/lib/components/stacks/Photos.test.ts --run
```

Expected: PASS for `Photos stack post date > renders entry.postDate with the shared Time component`.

- [ ] **Step 6: Run Svelte and TypeScript checks**

Run:

```bash
npm run check
```

Expected: PASS with no Svelte or TypeScript errors.

- [ ] **Step 7: Commit the implementation**

Run:

```bash
git add src/lib/components/stacks/Photos.svelte src/lib/components/stacks/Photos.test.ts
git commit -m "feat: show photo post dates"
```

Expected: commit succeeds and includes only the photos stack component plus its focused test.
