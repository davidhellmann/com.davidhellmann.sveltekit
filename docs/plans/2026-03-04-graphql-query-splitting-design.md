# Design: Split Monolithic GetEntries into Targeted GraphQL Queries

**Date:** 2026-03-04
**Status:** Approved

## Problem

The SvelteKit project uses a single `GetEntries` query that includes all 14 page-type fragments. Every query — whether fetching a home page or a blog post — sends fragments for all content types. This causes:

- Complex union types in generated TypeScript (`GetEntriesQuery.entries` is a union of 14 types)
- Manual type casting everywhere (`as { entries?: Page_XFragment[] }`)
- Unnecessary fragment payload in every request
- Harder to reason about what data a route actually needs

## Solution

Replace `GetEntries.graphql` with 11 targeted queries, each including only the fragments relevant to its use case.

## New Query Structure

### Queries to Create

| File | Query Name | Section | Fragments | Used By |
|------|-----------|---------|-----------|---------|
| `GetHome.graphql` | `GetHomeEntry` | home | page_home | `/` route |
| `GetAbout.graphql` | `GetAboutEntry` | pages (slug:"about") | page_about | `/about` route |
| `GetPageByUri.graphql` | `GetPageByUri` | pages (uri:X) | contentBuilder, company, workArea, workType | `/[uri=uri]/` route |
| `GetBlogEntries.graphql` | `GetBlogEntries` | blog | page_blogSingle + entryCount | Cache + `/blog/c/` + `/blog/t/` |
| `GetBlogListPage.graphql` | `GetBlogListPage` | pages (type:"page_blogList") | page_blogList | `/blog/` route |
| `GetCategoryEntry.graphql` | `GetCategoryEntry` | categories | page_category | `/blog/c/[slug]` route |
| `GetTopicEntry.graphql` | `GetTopicEntry` | topics | page_topic | `/blog/t/[slug]` route |
| `GetPhotosEntries.graphql` | `GetPhotosEntries` | photos | page_photosSingle + entryCount | Cache |
| `GetPhotosListPage.graphql` | `GetPhotosListPage` | pages (type:"page_photosList") | page_photosList | `/photos/` route |
| `GetWorkEntries.graphql` | `GetWorkEntries` | work | page_workSingle + entryCount | Cache |
| `GetWorkListPage.graphql` | `GetWorkListPage` | pages (type:"page_workList") | page_workList | `/work/` route |

### Queries Unchanged

- `GetPrerenderData.graphql` — lightweight, only fetches URIs/slugs for static generation
- `GetSeomatic.graphql` — already separate, fetches SEO metadata

### Query to Delete

- `GetEntries.graphql` — removed after all references are migrated

## Cache Layer Changes

The generic `entries-cache.ts` currently uses `GetEntries` for all sections. It will be updated to use specific queries:

- `getEntriesCache("blog")` → `getBlogCache()` using `GetBlogEntries`
- `getEntriesCache("work")` → `getWorkCache()` using `GetWorkEntries`
- `getEntriesCache("photos")` → `getPhotosCache()` using `GetPhotosEntries`

## TypeScript Typing Improvements

**Before:**
```typescript
// Manual casting required everywhere
const { entries } = (await getGqlData<GetEntriesQueryVariables>(
  GetEntriesDocument, { section: ["blog"], limit: 100 }
)) as { entries?: Page_BlogSingleFragment[] };
```

**After:**
```typescript
// Direct type from generated query — no casting
const { entries } = await getGqlData<GetBlogEntriesQueryVariables>(
  GetBlogEntriesDocument, { limit: 100 }
);
// entries is already typed as Page_BlogSingleFragment[]
```

## Route Migration Map

| Route File | Current Query | New Query |
|-----------|--------------|-----------|
| `/+page.server.ts` | GetEntries (section:home) | GetHomeEntry |
| `/about/+page.server.ts` | GetEntries (section:pages, slug:about) | GetAboutEntry |
| `/[uri=uri]/+page.server.ts` | GetEntries (section:pages, uri:X) | GetPageByUri |
| `/blog/[[page]]/+page.server.ts` | GetEntries (type:page_blogList) | GetBlogListPage |
| `/blog/c/[slug]/[[page]]/+page.server.ts` | GetEntries (section:blog + categories) | GetBlogEntries + GetCategoryEntry |
| `/blog/t/[slug]/[[page]]/+page.server.ts` | GetEntries (section:blog + topics) | GetBlogEntries + GetTopicEntry |
| `/photos/[[page]]/+page.server.ts` | GetEntries (type:page_photosList) | GetPhotosListPage |
| `/work/+page.server.ts` | GetEntries (type:page_workList) | GetWorkListPage |
| `entries-cache.ts` | GetEntries (generic) | Specific queries per section |

## Fragments

All existing fragments stay unchanged. They are already well-organized by content type. The only change is which queries reference which fragments.

## GetPageByUri Fragment Selection

The catch-all `/[uri=uri]/` route needs a smaller set of fragments (4 instead of 14):
- `page_contentBuilder` — generic content pages
- `page_company` — company pages
- `page_workArea` — work area taxonomy
- `page_workType` — work type taxonomy

Category and topic entries are now fetched via their own dedicated queries (`GetCategoryEntry`, `GetTopicEntry`).
