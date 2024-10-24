<script lang="ts">
  import type {
    Entry_DataFragment,
    Entry_DatesFragment,
    Entry_SeoFragment,
    EntryType_BlogDetailFragment
  } from "$graphql/graphql";
  import { tv, type VariantProps } from "tailwind-variants";
  import Pagination from "$components/navigation/Pagination.svelte";
  import CardBlog from "$components/card/Blog.svelte";
  import { type ComponentProps } from "svelte";

  const tvStackBlog = tv({
    slots: {
      slotWrapper: "",
      slotList: "grid grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3 gap-fluid"
    }
  });

  type Entry = Entry_DataFragment
    & EntryType_BlogDetailFragment
    & Entry_SeoFragment
    & Entry_DatesFragment;

  type StackBlogProps = {
    compName?: string;
    className?: string;
    entries: Entry[];
    showPagination?: boolean;
    totalItems?: number;
    totalPages?: number;
    page?: number;
  } & VariantProps<typeof tvStackBlog>;

  let {
    compName = "StackBlog",
    className,
    entries,
    showPagination = true,
    totalItems,
    totalPages,
    page
  }: StackBlogProps = $props();

  const { slotWrapper, slotList } = tvStackBlog({ className });

  const getColWidth = (index: number, page: number = 1): {
    colSpan: string,
    theme: ComponentProps<typeof CardBlog>["theme"]
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
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        yPosition="top"
        simple={true}
        uri="/blog"
        className="-mt-32"
      />
    {/if}

    <ul class={slotList({ className })} data-waypoint>
      {#each entries as entry, i (entry.id)}
        {#if entry?.__typename === "entryBlogDetail_Entry"}
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

    {#if showPagination && totalItems && totalPages && page}
      <Pagination
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        uri="/blog"
      />
    {/if}
  </div>
{/if}
