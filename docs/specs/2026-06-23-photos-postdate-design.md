# Photos Stack Post Date Design

## Goal

Show each photo entry's `postDate` underneath the camera metadata in `src/lib/components/stacks/Photos.svelte`, matching the blog date presentation.

## Approach

Use the existing `$components/text/Time.svelte` component directly in `Photos.svelte`. This keeps date formatting, icon rendering, and timestamp normalization consistent with blog cards and avoids adding new formatting logic.

## Component Changes

- Import `Time` from `$components/text/Time.svelte` in `Photos.svelte`.
- Render `<Time timestamp={entry.postDate} />` below the existing camera list.
- Only render the date when `entry.postDate` exists.

## Data Flow

`Photos.svelte` entries already include `Entry_DatesFragment`, so `postDate` is available on the existing entry type. No GraphQL query or type-generation change is required.

## Error Handling

If `postDate` is missing or cannot be normalized by the existing date utility, the `Time` component renders nothing. This matches existing project behavior.

## Testing

Run the project checks after implementation:

- `npm run check`

Optionally inspect the photos listing visually to confirm the date appears under the camera metadata and matches the blog date style.
