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
  import { getExifData } from "$utils/getExifData";
  import { type ComponentProps } from "svelte";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  const tvStackPhotos = tv({
    slots: {
      slotRoot: "",
      slotList: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
      slotListItem: "",
      slotListItemLink:
        "group border-1 overflow-hidden border-neutral-300 shadow-md shadow-neutral-200 p-8 pt-12 transition-all grayscale-100 hover:grayscale-0 hover:translate-y-0.5 hover:shadow-2xs h-full flex flex-col gap-8",
      slotGearList:
        "font-mono text-xs font-medium text-neutral-400 opacity-0 translate-y-4 transition-all group-hover:opacity-100 group-hover:translate-y-0 -mt-6"
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

  const { slotRoot, slotList, slotListItem, slotListItemLink, slotGearList } = tvStackPhotos({ className });
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
        theme="photos"
      />
    {/if}

    <ul class={slotList()} use:useWaypoint data-waypoint>
      {#each entries as entry, i (entry.id)}
        {#if entry?.__typename === "entryPhotosSingle_Entry"}
          {#if entry?.title && entry?.url && entry?.images}
            {@const exifDataParsed = getExifData(entry?.images)}
            <li class={`is-zoomInUp ${slotListItem()}`} data-waypoint-target>
              <a class={slotListItemLink()} href={entry?.url}>
                <span
                  class="font-mono text-xs font-bold -mb-6 bg-neutral-100 text-[red] group-hover:bg-[red] self-start leading-[1cap] size-8 flex items-center justify-center rounded-full group-hover:text-white"
                  >{entry?.images?.length}</span
                >
                <Headline className="font-mono text-sm font-medium leading-tight" text={entry?.title} />

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

                <Image ratio="aspect-auto" className="mt-auto z-10" image={entry?.image[0]} />
              </a>
            </li>
          {/if}
        {/if}
      {/each}
    </ul>

    {#if showPagination && totalItems && totalPages && totalPages > 1 && page}
      <Pagination {totalItems} {totalPages} currentPage={page} theme="photos" uri="/photos" />
    {/if}
  </div>
{/if}
