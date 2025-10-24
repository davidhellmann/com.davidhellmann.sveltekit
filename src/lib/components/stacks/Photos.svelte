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
      slotList: "grid grid-cols-1 divide-y-1 divide-neutral-200 divide-solid border-y-1 border-neutral-200",
      slotListItem: "",
      slotCount:
        "transition-colors mb-2 font-mono text-xs font-bold text-white bg-black group-hover:bg-[red] leading-[1] size-10 rounded-full flex items-center justify-center ",
      slotListItemLink:
        "group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10 py-6 px-6 lg:px-10 transition-colors bg-white  hover:bg-neutral-50",
      slotText: "w-full lg:w-1/2",
      slotImages: "flex gap-2 w-full lg:w-1/2 ",
      slotGearList: "font-mono text-xs font-medium text-neutral-400"
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

  const { slotRoot, slotList, slotListItem, slotCount, slotText, slotImages, slotListItemLink, slotGearList } =
    tvStackPhotos({
      className
    });
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
                <div class={slotText()}>
                  <span class={slotCount()}>{entry?.images?.length}</span>
                  <Headline className="font-mono text-base font-medium leading-tight" text={entry?.title} />

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
                </div>

                <div class={slotImages()}>
                  {#each entry?.previewImages as image, i (image.id)}
                    <div class="rounded-md grow overflow-hidden flex">
                      <Image ratio="aspect-instagram" className="hover:scale-105 transition-transform" {image} />
                    </div>
                  {/each}
                </div>
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
