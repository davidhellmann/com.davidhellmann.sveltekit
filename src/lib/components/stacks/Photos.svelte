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
  import Image from "$components/media/Image.svelte";
  import Headline from "$components/text/Headline.svelte";
  import { type ComponentProps } from "svelte";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  const tvStackPhotos = tv({
    slots: {
      slotRoot: "",
      slotList: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
      slotListItem: "",
      slotListItemLink:
        "border-1 border-neutral-300 shadow-md shadow-neutral-200 p-8 transition-all grayscale-100 hover:grayscale-0 hover:translate-y-0.5 hover:shadow-2xs h-full flex flex-col justify-between gap-24"
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

  const { slotRoot, slotList, slotListItem, slotListItemLink } = tvStackPhotos({ className });
</script>

{#if entries}
  <div class={slotRoot({ className })} data-comp={compName}>
    {#if showPagination && totalItems && totalPages && page && page > 1}
      <Pagination
        {totalItems}
        {totalPages}
        currentPage={page}
        yPosition="top"
        simple={true}
        uri="/photos"
        className="-mt-32"
      />
    {/if}

    <ul class={slotList()} use:useWaypoint data-waypoint>
      {#each entries as entry, i (entry.id)}
        {#if entry?.__typename === "entryPhotosSingle_Entry"}
          {#if entry?.title && entry?.url && entry?.postDate}
            <li class={`is-zoomInUp ${slotListItem()}`} data-waypoint-target>
              <a class={slotListItemLink()} href={entry?.url}>
                <Headline className="font-mono text-sm font-medium" text={entry?.title} />
                <Image ratio="aspect-auto" image={entry?.image[0]} />
              </a>
            </li>
          {/if}
        {/if}
      {/each}
    </ul>

    {#if showPagination && totalItems && totalPages && totalPages > 1 && page}
      <Pagination {totalItems} {totalPages} currentPage={page} uri="/photos" />
    {/if}
  </div>
{/if}
