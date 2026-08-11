<script lang="ts">
  import type { BlogEntry, ContentDates, ContentLink, ContentSeo } from "$lib/types/content";
  import { tv, type VariantProps } from "$utils/classNames";
  import Pagination from "$components/navigation/Pagination.svelte";
  import CardBlog from "$components/cards/Blog.svelte";
  import { type ComponentProps } from "svelte";

  const tvStackWork = tv({
    slots: {
      slotWrapper: "",
      slotList: "grid grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3 gap-fluid"
    }
  });

  type Entry = ContentLink & BlogEntry & ContentSeo & ContentDates;

  type StackWorkProps = {
    compName?: string;
    className?: string;
    entries: Entry[];
    showPagination?: boolean;
    totalItems?: number;
    totalPages?: number;
    page?: number;
  } & VariantProps<typeof tvStackWork>;

  let {
    compName = "StackWork",
    className,
    entries,
    showPagination = true,
    totalItems,
    totalPages,
    page
  }: StackWorkProps = $props();

  const { slotWrapper, slotList } = tvStackWork({ className });

  const getColWidth = (
    index: number,
    page: number = 1
  ): {
    colSpan: string;
    theme: ComponentProps<typeof CardBlog>["theme"];
  } => {
    let colSpan;
    let theme: ComponentProps<typeof CardBlog>["theme"] = "default";
    if (page === 1) {
      colSpan = index <= 2 ? "col-span-1 @3xl:col-span-2 @6xl:col-span-3" : "col-span-1";
      if (index === 0) {
        theme = "high";
      } else if (index === 1) {
        theme = "middle";
      } else if (index === 2) {
        theme = "low";
      }
    } else {
      colSpan = "col-span-1";
    }

    return {
      colSpan,
      theme
    };
  };
</script>

{#if entries}
  <div class={slotWrapper({ className })} data-comp={compName}>
    {#if showPagination && totalItems && totalPages && page && page > 1}
      <Pagination
        {totalItems}
        {totalPages}
        currentPage={page}
        yPosition="top"
        simple={true}
        uri="/blog"
        className="-mt-32"
      />
    {/if}

    <ul class={slotList({ className })} data-waypoint>
      {#each entries as entry, i (entry.id)}
        {#if entry?.__typename === "page_blogSingle_Entry"}
          {#if entry?.title && entry?.url && entry?.postDate && entry.category[0]?.title}
            <li class={`${getColWidth(i, page).colSpan} is-zoomInUp`} data-waypoint-target>
              <CardBlog
                headline={entry.title}
                url={entry?.url}
                postDate={entry?.postDate}
                categoryTitle={entry.category[0].title}
                className="h-full"
                theme={getColWidth(i, page).theme}
              />
            </li>
          {/if}
        {/if}
      {/each}
    </ul>

    {#if showPagination && totalItems && totalPages && totalPages > 1 && page}
      <Pagination {totalItems} {totalPages} currentPage={page} uri="/blog" />
    {/if}
  </div>
{/if}
