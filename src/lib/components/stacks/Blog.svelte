<script lang="ts">
  import type {
    Entry_DataFragment,
    Entry_DatesFragment,
    Entry_SeoFragment,
    EntryType_BlogSingleFragment
  } from "$graphql/graphql";
  import { tv, type VariantProps } from "$utils/classNames";
  import Pagination from "$components/navigation/Pagination.svelte";
  import CardBlog from "$components/cards/Blog.svelte";
  import { type ComponentProps } from "svelte";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  const tvStackBlog = tv({
    slots: {
      slotWrapper: "",
      slotList: "grid grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3 gap-fluid"
    }
  });

  type Entry = Entry_DataFragment & EntryType_BlogSingleFragment & Entry_SeoFragment & Entry_DatesFragment;

  type StackBlogProps = {
    compName?: string;
    className?: string;
    entries: Entry[];
    showPagination?: boolean;
    paginationUri?: string;
    totalItems?: number;
    totalPages?: number;
    page?: number;
  } & VariantProps<typeof tvStackBlog>;

  let {
    compName = "StackBlog",
    className,
    entries,
    showPagination = true,
    paginationUri = "/blog",
    totalItems,
    totalPages,
    page
  }: StackBlogProps = $props();

  const { slotWrapper, slotList } = tvStackBlog({ className });

  const getColWidth = (
    index: number,
    page: number = 1
  ): {
    colSpan: string;
    theme: ComponentProps<typeof CardBlog>["theme"];
    size: ComponentProps<typeof CardBlog>["size"];
  } => {
    let colSpan;
    let theme: ComponentProps<typeof CardBlog>["theme"] = "default";
    let size: ComponentProps<typeof CardBlog>["size"] = "default";
    if (page === 1) {
      colSpan = index <= 2 ? "col-span-1 @3xl:col-span-2 @6xl:col-span-3" : "col-span-1";
      if (index === 0) {
        theme = "high";
        size = "large";
      } else if (index === 1) {
        theme = "middle";
        size = "large";
      } else if (index === 2) {
        theme = "low";
        size = "large";
      }
    } else {
      colSpan = "col-span-1";
    }

    return {
      colSpan,
      theme,
      size
    };
  };
</script>

{#if entries}
  <div class={slotWrapper({ className })} data-comp={compName}>
    <!-- {#if showPagination && totalItems && totalPages && page && page > 1}
      <Pagination
        {totalItems}
        {totalPages}
        currentPage={page}
        yPosition="top"
        simple={true}
        uri={paginationUri}
        className="-mt-28 pt-2 md:pt-0 md:-mt-32"
      />
    {/if} -->

    {#key page}
      <ul class={slotList({ className })} use:useWaypoint data-waypoint>
        {#each entries as entry, i (entry.id)}
          {#if entry?.__typename === "entryBlogSingle_Entry"}
            {#if entry?.title && entry?.url && entry?.postDate && entry.category[0]?.title}
              <li class={`${getColWidth(i, page).colSpan} is-zoomInUp`} data-waypoint-target>
                <CardBlog
                  headline={entry.title}
                  url={entry?.url}
                  postDate={entry?.postDate}
                  categoryTitle={entry.category[0].title}
                  className="h-full"
                  theme={getColWidth(i, page).theme}
                  size={getColWidth(i, page).size}
                />
              </li>
            {/if}
          {/if}
        {/each}
      </ul>
    {/key}

    {#if showPagination && totalItems && totalPages && totalPages > 1 && page}
      <Pagination {totalItems} {totalPages} currentPage={page} uri={paginationUri} />
    {/if}
  </div>
{/if}
