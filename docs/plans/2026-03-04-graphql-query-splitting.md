# Split GetEntries into Targeted GraphQL Queries — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the monolithic `GetEntries.graphql` with 11 targeted queries to improve TypeScript typing and reduce unnecessary fragment payloads.

**Architecture:** Each route/data-layer gets its own query that includes only the fragments it needs. The generic `entries-cache.ts` gets updated to accept query documents instead of hardcoding `GetEntriesDocument`.

**Tech Stack:** GraphQL, graphql-request, graphql-codegen, SvelteKit, TypeScript

**Design Doc:** `docs/plans/2026-03-04-graphql-query-splitting-design.md`

---

### Task 1: Create all 11 new GraphQL query files

**Files:**
- Create: `src/lib/graphql/queries/entries/GetHome.graphql`
- Create: `src/lib/graphql/queries/entries/GetAbout.graphql`
- Create: `src/lib/graphql/queries/entries/GetPageByUri.graphql`
- Create: `src/lib/graphql/queries/entries/GetBlogEntries.graphql`
- Create: `src/lib/graphql/queries/entries/GetBlogListPage.graphql`
- Create: `src/lib/graphql/queries/entries/GetCategoryEntry.graphql`
- Create: `src/lib/graphql/queries/entries/GetTopicEntry.graphql`
- Create: `src/lib/graphql/queries/entries/GetPhotosEntries.graphql`
- Create: `src/lib/graphql/queries/entries/GetPhotosListPage.graphql`
- Create: `src/lib/graphql/queries/entries/GetWorkEntries.graphql`
- Create: `src/lib/graphql/queries/entries/GetWorkListPage.graphql`

**Step 1: Create GetHome.graphql**

```graphql
query GetHomeEntry(
  $site: [String] = ["davidhellmann_en"]
  $limit: Int = 1
) {
  entries(
    site: $site,
    section: ["home"],
    limit: $limit
  ) {
    ...page_home
  }
}
```

**Step 2: Create GetAbout.graphql**

```graphql
query GetAboutEntry(
  $site: [String] = ["davidhellmann_en"]
  $slug: [String] = ["about"]
  $limit: Int = 1
) {
  entries(
    site: $site,
    section: ["pages"],
    slug: $slug,
    limit: $limit
  ) {
    ...page_about
  }
}
```

**Step 3: Create GetPageByUri.graphql**

```graphql
query GetPageByUri(
  $site: [String] = ["davidhellmann_en"]
  $uri: [String]
  $limit: Int = 1
) {
  entries(
    site: $site,
    section: ["pages"],
    uri: $uri,
    limit: $limit
  ) {
    ...page_contentBuilder
    ...page_company
    ...page_workArea
    ...page_workType
  }
}
```

**Step 4: Create GetBlogEntries.graphql**

```graphql
query GetBlogEntries(
  $site: [String] = ["davidhellmann_en"]
  $limit: Int = 100
  $offset: Int = 0
  $orderBy: String = "postDate DESC"
  $relatedToEntries: [EntryRelationCriteriaInput]
) {
  entries(
    site: $site,
    section: ["blog"],
    limit: $limit,
    offset: $offset,
    orderBy: $orderBy,
    relatedToEntries: $relatedToEntries
  ) {
    ...page_blogSingle
  }
  entryCount(
    site: $site,
    section: ["blog"],
    relatedToEntries: $relatedToEntries
  )
}
```

**Step 5: Create GetBlogListPage.graphql**

```graphql
query GetBlogListPage(
  $site: [String] = ["davidhellmann_en"]
  $limit: Int = 1
) {
  entries(
    site: $site,
    section: ["pages"],
    type: ["page_blogList"],
    limit: $limit
  ) {
    ...page_blogList
  }
}
```

**Step 6: Create GetCategoryEntry.graphql**

```graphql
query GetCategoryEntry(
  $site: [String] = ["davidhellmann_en"]
  $slug: [String]
  $limit: Int = 1
) {
  entries(
    site: $site,
    section: ["categories"],
    slug: $slug,
    limit: $limit
  ) {
    ...page_category
  }
}
```

**Step 7: Create GetTopicEntry.graphql**

```graphql
query GetTopicEntry(
  $site: [String] = ["davidhellmann_en"]
  $slug: [String]
  $limit: Int = 1
) {
  entries(
    site: $site,
    section: ["topics"],
    slug: $slug,
    limit: $limit
  ) {
    ...page_topic
  }
}
```

**Step 8: Create GetPhotosEntries.graphql**

```graphql
query GetPhotosEntries(
  $site: [String] = ["davidhellmann_en"]
  $limit: Int = 100
  $offset: Int = 0
  $orderBy: String = "postDate DESC"
) {
  entries(
    site: $site,
    section: ["photos"],
    limit: $limit,
    offset: $offset,
    orderBy: $orderBy
  ) {
    ...page_photosSingle
  }
  entryCount(
    site: $site,
    section: ["photos"]
  )
}
```

**Step 9: Create GetPhotosListPage.graphql**

```graphql
query GetPhotosListPage(
  $site: [String] = ["davidhellmann_en"]
  $limit: Int = 1
) {
  entries(
    site: $site,
    section: ["pages"],
    type: ["page_photosList"],
    limit: $limit
  ) {
    ...page_photosList
  }
}
```

**Step 10: Create GetWorkEntries.graphql**

```graphql
query GetWorkEntries(
  $site: [String] = ["davidhellmann_en"]
  $limit: Int = 100
  $offset: Int = 0
  $orderBy: String = "postDate DESC"
) {
  entries(
    site: $site,
    section: ["work"],
    limit: $limit,
    offset: $offset,
    orderBy: $orderBy
  ) {
    ...page_workSingle
  }
  entryCount(
    site: $site,
    section: ["work"]
  )
}
```

**Step 11: Create GetWorkListPage.graphql**

```graphql
query GetWorkListPage(
  $site: [String] = ["davidhellmann_en"]
  $limit: Int = 1
) {
  entries(
    site: $site,
    section: ["pages"],
    type: ["page_workList"],
    limit: $limit
  ) {
    ...page_workList
  }
}
```

**Step 12: Commit**

```bash
git add src/lib/graphql/queries/entries/Get*.graphql
git commit -m "feat: add 11 targeted GraphQL query files"
```

---

### Task 2: Run codegen and verify new types are generated

**Step 1: Run GraphQL codegen**

Run: `npm run codegen`

Expected: Codegen completes successfully, `src/lib/graphql/graphql.ts` is updated with new query types.

**Step 2: Verify new types exist**

Check that `graphql.ts` now exports these types (search for them):
- `GetHomeEntryDocument`, `GetHomeEntryQuery`, `GetHomeEntryQueryVariables`
- `GetAboutEntryDocument`, `GetAboutEntryQuery`, `GetAboutEntryQueryVariables`
- `GetPageByUriDocument`, `GetPageByUriQuery`, `GetPageByUriQueryVariables`
- `GetBlogEntriesDocument`, `GetBlogEntriesQuery`, `GetBlogEntriesQueryVariables`
- `GetBlogListPageDocument`, `GetBlogListPageQuery`, `GetBlogListPageQueryVariables`
- `GetCategoryEntryDocument`, `GetCategoryEntryQuery`, `GetCategoryEntryQueryVariables`
- `GetTopicEntryDocument`, `GetTopicEntryQuery`, `GetTopicEntryQueryVariables`
- `GetPhotosEntriesDocument`, `GetPhotosEntriesQuery`, `GetPhotosEntriesQueryVariables`
- `GetPhotosListPageDocument`, `GetPhotosListPageQuery`, `GetPhotosListPageQueryVariables`
- `GetWorkEntriesDocument`, `GetWorkEntriesQuery`, `GetWorkEntriesQueryVariables`
- `GetWorkListPageDocument`, `GetWorkListPageQuery`, `GetWorkListPageQueryVariables`

**Step 3: Commit generated types**

```bash
git add src/lib/graphql/graphql.ts
git commit -m "chore: regenerate GraphQL types with new targeted queries"
```

---

### Task 3: Update entries-cache.ts to accept query documents

**Files:**
- Modify: `src/lib/data/entries-cache.ts`

**Step 1: Update entries-cache.ts**

Replace the entire file with:

```typescript
import { getGqlData } from "$graphql/graphql-client";
import type { RequestDocument } from "graphql-request";

type EntryWithSlug = { slug?: string | null; [key: string]: unknown };

const caches = new Map<string, Map<string, EntryWithSlug>>();
const fetchPromises = new Map<string, Promise<Map<string, EntryWithSlug>>>();

const BATCH_SIZE = Number(import.meta.env.VITE_BATCH_SIZE) || 100;

export async function getEntriesCache<T extends EntryWithSlug>(
  cacheKey: string,
  queryDocument: RequestDocument
): Promise<Map<string, T>> {
  if (caches.has(cacheKey)) return caches.get(cacheKey) as Map<string, T>;
  if (fetchPromises.has(cacheKey)) return fetchPromises.get(cacheKey) as Promise<Map<string, T>>;

  const promise = (async () => {
    const allEntries: T[] = [];
    let offset = 0;

    console.log(`[${cacheKey} Cache] Fetching in batches of ${BATCH_SIZE}...`);

    while (true) {
      const data = (await getGqlData(queryDocument, {
        limit: BATCH_SIZE,
        offset
      })) as { entries?: T[] };

      if (!data.entries?.length) break;
      allEntries.push(...data.entries);
      console.log(`[${cacheKey} Cache] Batch ${Math.floor(offset / BATCH_SIZE) + 1}: ${data.entries.length} (total: ${allEntries.length})`);
      if (data.entries.length < BATCH_SIZE) break;
      offset += BATCH_SIZE;
    }

    const cache = new Map(allEntries.map((e) => [e.slug!, e]));
    caches.set(cacheKey, cache);
    console.log(`[${cacheKey} Cache] Loaded ${cache.size} entries`);
    return cache;
  })();

  fetchPromises.set(cacheKey, promise);
  return promise as Promise<Map<string, T>>;
}

export async function getEntry<T extends EntryWithSlug>(
  cacheKey: string,
  queryDocument: RequestDocument,
  slug: string
): Promise<T | undefined> {
  const cache = await getEntriesCache<T>(cacheKey, queryDocument);
  return cache.get(slug);
}

export async function getEntriesArray<T extends EntryWithSlug>(
  cacheKey: string,
  queryDocument: RequestDocument
): Promise<T[]> {
  const cache = await getEntriesCache<T>(cacheKey, queryDocument);
  return [...cache.values()];
}

export async function getEntriesCount(
  cacheKey: string,
  queryDocument: RequestDocument
): Promise<number> {
  const cache = await getEntriesCache(cacheKey, queryDocument);
  return cache.size;
}
```

Key changes:
- Removed `GetEntriesDocument` import — no longer depends on the monolithic query
- Added `queryDocument: RequestDocument` parameter to all functions
- Renamed parameter `section` → `cacheKey` (more accurate since the query handles the section)
- Uses `getGqlData(queryDocument, { limit, offset })` instead of hardcoding variables

**Step 2: Commit**

```bash
git add src/lib/data/entries-cache.ts
git commit -m "refactor: update entries-cache to accept query documents"
```

---

### Task 4: Update data layer files (blog.ts, work.ts, photos.ts)

**Files:**
- Modify: `src/lib/data/blog.ts`
- Modify: `src/lib/data/work.ts`
- Modify: `src/lib/data/photos.ts`

**Step 1: Update blog.ts**

```typescript
import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { GetBlogEntriesDocument, type Page_BlogSingleFragment } from "$graphql/graphql";

export const getBlogEntries = () => getEntriesCache<Page_BlogSingleFragment>("blog", GetBlogEntriesDocument);
export const getBlogEntry = (slug: string) => getEntry<Page_BlogSingleFragment>("blog", GetBlogEntriesDocument, slug);
export const getBlogArray = () => getEntriesArray<Page_BlogSingleFragment>("blog", GetBlogEntriesDocument);
export const getBlogCount = () => getEntriesCount("blog", GetBlogEntriesDocument);
```

**Step 2: Update work.ts**

```typescript
import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { GetWorkEntriesDocument, type Page_WorkSingleFragment } from "$graphql/graphql";

export const getWorkEntries = () => getEntriesCache<Page_WorkSingleFragment>("work", GetWorkEntriesDocument);
export const getWorkEntry = (slug: string) => getEntry<Page_WorkSingleFragment>("work", GetWorkEntriesDocument, slug);
export const getWorkArray = () => getEntriesArray<Page_WorkSingleFragment>("work", GetWorkEntriesDocument);
export const getWorkCount = () => getEntriesCount("work", GetWorkEntriesDocument);
```

**Step 3: Update photos.ts**

```typescript
import { getEntriesCache, getEntry, getEntriesArray, getEntriesCount } from "./entries-cache";
import { GetPhotosEntriesDocument, type Page_PhotosSingleFragment } from "$graphql/graphql";

export const getPhotosEntries = () => getEntriesCache<Page_PhotosSingleFragment>("photos", GetPhotosEntriesDocument);
export const getPhotosEntry = (slug: string) => getEntry<Page_PhotosSingleFragment>("photos", GetPhotosEntriesDocument, slug);
export const getPhotosArray = () => getEntriesArray<Page_PhotosSingleFragment>("photos", GetPhotosEntriesDocument);
export const getPhotosCount = () => getEntriesCount("photos", GetPhotosEntriesDocument);
```

**Step 4: Commit**

```bash
git add src/lib/data/blog.ts src/lib/data/work.ts src/lib/data/photos.ts
git commit -m "refactor: update data layer to use targeted query documents"
```

---

### Task 5: Migrate Home route

**Files:**
- Modify: `src/routes/+page.server.ts`

**Step 1: Update imports and query call**

```typescript
export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetHomeEntryDocument, type Page_HomeFragment, type GetHomeEntryQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getBlogArray } from "$lib/data/blog";
import { getWorkArray } from "$lib/data/work";
import { getPhotosArray } from "$lib/data/photos";

const shuffle = <T>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetHomeEntryQueryVariables>(GetHomeEntryDocument, {})) as {
    entries?: Page_HomeFragment[];
  };

  const blogEntries = (await getBlogArray()).slice(0, 3);
  const workEntries = shuffle(await getWorkArray()).slice(0, 4);
  const photoEntries = shuffle(await getPhotosArray()).slice(0, 4);

  return {
    entries: entries,
    blogEntries: blogEntries,
    workEntries: workEntries,
    photoEntries: photoEntries
  };
};
```

Changes: `GetEntriesDocument` → `GetHomeEntryDocument`, `GetEntriesQueryVariables` → `GetHomeEntryQueryVariables`, removed `section: ["home"], limit: 1` (hardcoded in query with defaults).

**Step 2: Commit**

```bash
git add src/routes/+page.server.ts
git commit -m "refactor: migrate home route to GetHomeEntry query"
```

---

### Task 6: Migrate About route

**Files:**
- Modify: `src/routes/about/+page.server.ts`

**Step 1: Update imports and query call**

```typescript
export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetAboutEntryDocument, type Page_AboutFragment, type GetAboutEntryQueryVariables } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const load: PageServerLoad = async () => {
  const { entries } = (await getGqlData<GetAboutEntryQueryVariables>(GetAboutEntryDocument, {})) as {
    entries?: Page_AboutFragment[];
  };

  return {
    entries: entries
  };
};
```

Changes: `GetEntriesDocument` → `GetAboutEntryDocument`, `GetEntriesQueryVariables` → `GetAboutEntryQueryVariables`, removed `section: ["pages"], slug: "about", limit: 1` (hardcoded in query with defaults).

**Step 2: Commit**

```bash
git add src/routes/about/+page.server.ts
git commit -m "refactor: migrate about route to GetAboutEntry query"
```

---

### Task 7: Migrate [uri=uri] catch-all route

**Files:**
- Modify: `src/routes/[uri=uri]/+page.server.ts`

**Step 1: Update imports and query call**

```typescript
export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import {
  GetPageByUriDocument,
  type GetPageByUriQueryVariables,
  GetPrerenderDataDocument,
  type GetPrerenderDataQueryVariables,
  type Page_ContentBuilderFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

export const entries: EntryGenerator = async () => {
  const { entries } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["pages"],
    limit: 999
  })) as { entries?: Page_ContentBuilderFragment[] };

  return entries?.map((entry) => {
    if (entry) {
      return {
        uri: entry.uri
      };
    }
  }) as RouteParams[];
};

export const load: PageServerLoad = async ({ params }) => {
  const { entries } = (await getGqlData<GetPageByUriQueryVariables>(GetPageByUriDocument, {
    uri: [params?.uri]
  })) as { entries?: Page_ContentBuilderFragment[] };

  return {
    entries: entries
  };
};
```

Changes: `GetEntriesDocument` → `GetPageByUriDocument`, `GetEntriesQueryVariables` → `GetPageByUriQueryVariables`, variables changed from `{ section: ["pages"], uri: params?.uri }` to `{ uri: [params?.uri] }`. Note: `uri` is wrapped in array to match the `$uri: [String]` variable type. The `entries` EntryGenerator still uses `GetPrerenderData` (unchanged).

**Step 2: Commit**

```bash
git add src/routes/\\[uri=uri\\]/+page.server.ts
git commit -m "refactor: migrate catch-all route to GetPageByUri query"
```

---

### Task 8: Migrate Blog list route

**Files:**
- Modify: `src/routes/blog/[[page=page]]/+page.server.ts`

**Step 1: Update imports and query call**

```typescript
export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import { GetBlogListPageDocument, type GetBlogListPageQueryVariables, type Page_BlogListFragment } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getBlogArray, getBlogCount } from "$lib/data/blog";

const limit = 24;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  const entryCount = await getBlogCount();
  const routes: RouteParams[] = [];
  const totalPages = getTotalPages(entryCount, limit);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1) {
      routes.push({ page: undefined });
      routes.push({ page: "1" });
    } else {
      routes.push({ page: i.toString() });
    }
  }

  return routes;
};

export const load: PageServerLoad = async ({ params }) => {
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * limit || 0;

  if (page === 1 && params.page === "1") {
    redirect(301, "/blog");
  }

  const allBlog = await getBlogArray();
  const entries = allBlog.slice(offset, offset + limit);
  const entryCount = allBlog.length;
  const totalPages = getTotalPages(entryCount, limit);

  if (entries.length === 0) {
    redirect(307, `/blog/${totalPages}`);
  }

  const { entries: blogEntry } = (await getGqlData<GetBlogListPageQueryVariables>(GetBlogListPageDocument, {})) as {
    entries?: Page_BlogListFragment[];
  };

  return {
    blogEntry: blogEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
```

Changes: `GetEntriesDocument` → `GetBlogListPageDocument`, `GetEntriesQueryVariables` → `GetBlogListPageQueryVariables`, removed `{ section: ["pages"], type: "page_blogList", limit: 1 }` → `{}` (all hardcoded in query defaults).

**Step 2: Commit**

```bash
git add src/routes/blog/\\[\\[page=page\\]\\]/+page.server.ts
git commit -m "refactor: migrate blog list route to GetBlogListPage query"
```

---

### Task 9: Migrate Blog-by-Category route

**Files:**
- Modify: `src/routes/blog/c/[slug=slug]/[[page=page]]/+page.server.ts`

**Step 1: Update imports and query calls**

```typescript
export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  GetBlogEntriesDocument,
  type GetBlogEntriesQueryVariables,
  GetCategoryEntryDocument,
  type GetCategoryEntryQueryVariables,
  GetPrerenderDataDocument,
  type GetPrerenderDataQueryVariables,
  type GetPrerenderDataQuery,
  type Page_BlogSingleFragment,
  type Page_CategoryFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

const limit = 48;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  const { entries: categories } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["categories"],
    limit: 999
  })) as GetPrerenderDataQuery;

  const routes: RouteParams[] = [];

  for (const category of categories || []) {
    if (!category?.slug) continue;

    const { entryCount } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
      section: ["blog"],
      relatedToEntries: [
        {
          section: ["categories"],
          slug: [category.slug]
        }
      ]
    })) as GetPrerenderDataQuery;

    const totalPages = getTotalPages(entryCount, limit);

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1) {
        routes.push({
          slug: category.slug,
          page: undefined
        });
        routes.push({
          slug: category.slug,
          page: "1"
        });
      } else {
        routes.push({
          slug: category.slug,
          page: i.toString()
        });
      }
    }
  }

  return routes;
};

export const load: PageServerLoad = async ({ params, url }) => {
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * limit || 0;

  const { entries, entryCount } = (await getGqlData<GetBlogEntriesQueryVariables>(GetBlogEntriesDocument, {
    relatedToEntries: [
      {
        section: ["categories"],
        slug: [params?.slug]
      }
    ],
    limit: limit,
    offset: offset
  })) as { entries?: Page_BlogSingleFragment[]; entryCount: number };

  const totalPages = getTotalPages(entryCount, limit);

  const { entries: categoryEntry } = (await getGqlData<GetCategoryEntryQueryVariables>(GetCategoryEntryDocument, {
    slug: [params?.slug]
  })) as { entries?: Page_CategoryFragment[] };

  if (page === 1 && params.page === "1" && categoryEntry?.[0]?.uri) {
    redirect(301, `/${categoryEntry[0].uri}`);
  }

  if (entries?.length === 0) {
    redirect(307, `/${categoryEntry?.[0]?.uri}/${totalPages}`);
  }

  return {
    categoryEntry: categoryEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
```

Changes:
- Blog entries: `GetEntriesDocument` → `GetBlogEntriesDocument`, removed `section: ["blog"]` from variables (hardcoded in query)
- Category entry: `GetEntriesDocument` → `GetCategoryEntryDocument`, removed `section: ["categories"], limit: 1` from variables (hardcoded in query)
- `entries` EntryGenerator still uses `GetPrerenderData` (unchanged)

**Step 2: Commit**

```bash
git add src/routes/blog/c/\\[slug=slug\\]/\\[\\[page=page\\]\\]/+page.server.ts
git commit -m "refactor: migrate blog-by-category route to targeted queries"
```

---

### Task 10: Migrate Blog-by-Topic route

**Files:**
- Modify: `src/routes/blog/t/[slug=slug]/[[page=page]]/+page.server.ts`

**Step 1: Update imports and query calls**

```typescript
export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  GetBlogEntriesDocument,
  type GetBlogEntriesQueryVariables,
  GetTopicEntryDocument,
  type GetTopicEntryQueryVariables,
  GetPrerenderDataDocument,
  type GetPrerenderDataQueryVariables,
  type GetPrerenderDataQuery,
  type Page_BlogSingleFragment,
  type Page_TopicFragment
} from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";

const limit = 48;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  const { entries: topics } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
    section: ["topics"],
    limit: 999
  })) as GetPrerenderDataQuery;

  const routes: RouteParams[] = [];

  for (const category of topics || []) {
    if (!category?.slug) continue;

    const { entryCount } = (await getGqlData<GetPrerenderDataQueryVariables>(GetPrerenderDataDocument, {
      section: ["blog"],
      relatedToEntries: [
        {
          section: ["topics"],
          slug: [category.slug]
        }
      ]
    })) as GetPrerenderDataQuery;

    const totalPages = getTotalPages(entryCount, limit);

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1) {
        routes.push({
          slug: category.slug,
          page: undefined
        });
        routes.push({
          slug: category.slug,
          page: "1"
        });
      } else {
        routes.push({
          slug: category.slug,
          page: i.toString()
        });
      }
    }
  }

  return routes;
};

export const load: PageServerLoad = async ({ params }) => {
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * limit || 0;

  const { entries, entryCount } = (await getGqlData<GetBlogEntriesQueryVariables>(GetBlogEntriesDocument, {
    relatedToEntries: [
      {
        section: ["topics"],
        slug: [params?.slug]
      }
    ],
    limit: limit,
    offset: offset
  })) as { entries?: Page_BlogSingleFragment[]; entryCount: number };

  const totalPages = getTotalPages(entryCount, limit);

  const { entries: topicEntry } = (await getGqlData<GetTopicEntryQueryVariables>(GetTopicEntryDocument, {
    slug: [params?.slug]
  })) as { entries?: Page_TopicFragment[] };

  if (page === 1 && params.page === "1" && topicEntry?.[0]?.uri) {
    redirect(301, `/${topicEntry[0].uri}`);
  }

  if (entries?.length === 0) {
    redirect(307, `/${topicEntry?.[0]?.uri}/${totalPages}`);
  }

  return {
    topicEntry: topicEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
```

Changes: Same pattern as Task 9. Blog entries use `GetBlogEntriesDocument`, topic entry uses `GetTopicEntryDocument`.

**Step 2: Commit**

```bash
git add src/routes/blog/t/\\[slug=slug\\]/\\[\\[page=page\\]\\]/+page.server.ts
git commit -m "refactor: migrate blog-by-topic route to targeted queries"
```

---

### Task 11: Migrate Photos list route

**Files:**
- Modify: `src/routes/photos/[[page=page]]/+page.server.ts`

**Step 1: Update imports and query call**

```typescript
export const prerender = true;
import type { PageServerLoad, EntryGenerator, RouteParams } from "./$types";
import { redirect } from "@sveltejs/kit";
import { GetPhotosListPageDocument, type GetPhotosListPageQueryVariables, type Page_PhotosListFragment } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getPhotosArray, getPhotosCount } from "$lib/data/photos";

const limit = 24;
const getTotalPages = (entryCount: number, limit: number): number => {
  return Math.ceil(entryCount / limit);
};

export const entries: EntryGenerator = async () => {
  const entryCount = await getPhotosCount();
  const routes: RouteParams[] = [];
  const totalPages = getTotalPages(entryCount, limit);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1) {
      routes.push({ page: undefined });
      routes.push({ page: "1" });
    } else {
      routes.push({ page: i.toString() });
    }
  }

  return routes;
};

export const load: PageServerLoad = async ({ params }) => {
  const page = params.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * limit || 0;

  if (page === 1 && params.page === "1") {
    redirect(301, "/photos");
  }

  const allPhotos = await getPhotosArray();
  const entries = allPhotos.slice(offset, offset + limit);
  const entryCount = allPhotos.length;
  const totalPages = getTotalPages(entryCount, limit);

  if (entries.length === 0) {
    redirect(307, `/photos/${totalPages}`);
  }

  const { entries: photosEntry } = (await getGqlData<GetPhotosListPageQueryVariables>(GetPhotosListPageDocument, {})) as {
    entries?: Page_PhotosListFragment[];
  };

  return {
    photosEntry: photosEntry,
    entries: entries,
    entryCount: entryCount,
    totalPages: totalPages,
    page: page
  };
};
```

Changes: `GetEntriesDocument` → `GetPhotosListPageDocument`, `GetEntriesQueryVariables` → `GetPhotosListPageQueryVariables`, removed all variables → `{}`.

**Step 2: Commit**

```bash
git add src/routes/photos/\\[\\[page=page\\]\\]/+page.server.ts
git commit -m "refactor: migrate photos list route to GetPhotosListPage query"
```

---

### Task 12: Migrate Work list route

**Files:**
- Modify: `src/routes/work/+page.server.ts`

**Step 1: Update imports and query call**

```typescript
export const prerender = true;
import type { PageServerLoad } from "./$types";
import { GetWorkListPageDocument, type GetWorkListPageQueryVariables, type Page_WorkListFragment } from "$graphql/graphql";
import { getGqlData } from "$graphql/graphql-client";
import { getWorkArray } from "$lib/data/work";

export const load: PageServerLoad = async () => {
  const workEntries = await getWorkArray();

  const { entries: workEntry } = (await getGqlData<GetWorkListPageQueryVariables>(GetWorkListPageDocument, {})) as {
    entries: Page_WorkListFragment[];
  };

  return {
    workEntry: workEntry,
    workEntries: workEntries
  };
};
```

Changes: `GetEntriesDocument` → `GetWorkListPageDocument`, `GetEntriesQueryVariables` → `GetWorkListPageQueryVariables`, removed `{ section: ["pages"], type: "page_workList" }` → `{}`.

**Note:** The current code imports `Page_workListFragment` (lowercase w). The codegen may generate `Page_WorkListFragment` (capital W). Verify the correct casing from the generated `graphql.ts` file after codegen. Use whichever the codegen produces.

**Step 2: Commit**

```bash
git add src/routes/work/+page.server.ts
git commit -m "refactor: migrate work list route to GetWorkListPage query"
```

---

### Task 13: Delete GetEntries.graphql and regenerate types

**Files:**
- Delete: `src/lib/graphql/queries/entries/GetEntries.graphql`

**Step 1: Verify no remaining references to GetEntries**

Run: `grep -r "GetEntries" src/ --include="*.ts" --include="*.svelte"`

Expected: No matches (only references should be in the generated `graphql.ts` which will be regenerated).

If references remain, fix them before proceeding.

**Step 2: Delete GetEntries.graphql**

Run: `rm src/lib/graphql/queries/entries/GetEntries.graphql`

**Step 3: Run codegen to regenerate types**

Run: `npm run codegen`

Expected: Codegen succeeds. The generated `graphql.ts` no longer contains `GetEntriesDocument`, `GetEntriesQuery`, or `GetEntriesQueryVariables`.

**Step 4: Commit**

```bash
git add -A src/lib/graphql/
git commit -m "refactor: remove monolithic GetEntries.graphql"
```

---

### Task 14: Run type check and build

**Step 1: Run TypeScript type check**

Run: `npm run check`

Expected: No errors. All route files and data files use correctly typed query imports.

**Step 2: Run production build**

Run: `npm run build`

Expected: Build succeeds. All pages are pre-rendered correctly.

If errors occur, fix them before proceeding.

**Step 3: Commit any formatting/fix changes if needed**

```bash
git add -A
git commit -m "chore: fix any remaining type or build issues"
```

---

## Routes that need NO changes (for reference)

These routes don't use `GetEntries` and need no modification:
- `src/routes/blog/[slug=slug]/+page.server.ts` — uses cache only (`getBlogEntry`)
- `src/routes/photos/[slug=slug]/+page.server.ts` — uses cache only (`getPhotosEntry`)
- `src/routes/work/[slug=slug]/+page.server.ts` — uses cache only (`getWorkEntry`)

These routes still use `GetPrerenderData` (unchanged, stays as-is):
- `src/routes/[uri=uri]/+page.server.ts` — for `entries` EntryGenerator
- `src/routes/blog/c/[slug=slug]/[[page=page]]/+page.server.ts` — for `entries` EntryGenerator
- `src/routes/blog/t/[slug=slug]/[[page=page]]/+page.server.ts` — for `entries` EntryGenerator
