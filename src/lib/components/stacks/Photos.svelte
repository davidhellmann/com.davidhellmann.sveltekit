<script lang="ts">
  import type {
    Entry_DataFragment,
    Entry_DatesFragment,
    Entry_SeoFragment,
    EntryType_PhotosSingleFragment
  } from "$graphql/graphql";
  import { tv, type VariantProps } from "tailwind-variants";
  import Pagination from "$components/navigation/Pagination.svelte";
  import CardPhotos from "$components/cards/Photos.svelte";
  import { type ComponentProps } from "svelte";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  const tvStackPhotos = tv({
    slots: {
      slotWrapper: "",
      slotList: "grid grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3 gap-fluid"
    }
  });

  type Entry = Entry_DataFragment & EntryType_PhotosSingleFragment & Entry_SeoFragment & Entry_DatesFragment;

  type StackPhotosProps = {
    compName?: string;
    className?: string;
    entries: Entry[];
    showPagination?: boolean;
    totalItems?: number;
    totalPages?: number;
    page?: number;
  } & VariantProps<typeof tvStackPhotos>;

  let {
    compName = "StackPhotos",
    className,
    entries,
    showPagination = true,
    totalItems,
    totalPages,
    page
  }: StackPhotosProps = $props();

  const { slotWrapper, slotList } = tvStackPhotos({ className });
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

    <ul class={slotList({ className })} use:useWaypoint data-waypoint>
      {#each entries as entry, i (entry.id)}
        {#if entry?.__typename === "entryPhotosSingle_Entry"}
          {#if entry?.title && entry?.url && entry?.postDate}
            <li class="is-zoomInUp" data-waypoint-target>
              <CardPhotos headline={entry.title} url={entry?.url} image={entry?.images[0]} className="h-full" />
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
