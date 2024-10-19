<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$lib/components/ui/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  const tvPagination = tv({
    slots: {
      slotNav: "flex justify-center  text-xs",
      slotList: "flex bg-neutral-100 rounded-md overflow-clip shadow-sm shadow-neutral-400",
      slotListItem: "[&:not(:last-child)]:border-r-2 [&:not(:last-child)]:border-e-neutral-200",
      slotLink: "flex px-4 pt-3 pb-2 border-b-4 border-transparent items-center hover:bg-neutral-50 transition",
      slotSpacer: "flex px-4 pt-3 pb-2 border-b-4 border-transparent text-neutral-400",
      slotCurrent: "flex px-4 pt-3 pb-2 border-b-4 border-accent-pink-500",
    },
    variants: {
      position: {
        top: {
          slotNav: "mb-24",
        },
        bottom: {
          slotNav: "mt-24",
        },
        sticky: {
          slotNav: "",
        }
      }
    },
    defaultVariants: {
      position: "sticky"
    }
  });

  type PaginationProps = {
    compName?: string;
    className?: string;
    totalItems: number;
    limit: number;
    currentPage: number;
    iconPrev?: HeroiconsIcons;
    iconNext?: HeroiconsIcons;
  } & VariantProps<typeof tvPagination>;

  const {
    compName = "Pagination",
    className,
    totalItems,
    limit,
    currentPage = 1,
    iconPrev = "arrow-left-outline",
    iconNext = "arrow-right-outline"
  }: PaginationProps = $props();

  const totalPages: number = Math.ceil(totalItems / limit);
  const getRange = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const range = $derived(getRange(Math.max(1, currentPage - 2), Math.min(totalPages, currentPage + 2)));

  const { slotNav, slotList, slotListItem, slotLink, slotCurrent, slotSpacer } = tvPagination({});
</script>


<nav class={slotNav({ className })} data-comp={compName}>
  <ul class={slotList()}>
    {#if currentPage > 1}
      <li class={slotListItem()}>
        <a class={slotLink()} href="?p={currentPage - 1}">
          <IconSprite icon={iconPrev} />
        </a>
      </li>
    {/if}

    {#if totalPages <= 6}
      {#each { length: totalPages } as _, index (index)}
        <li class={slotListItem()}>
          <a class={slotLink()} href="?p={index + 1}">{index + 1}</a>
        </li>
      {/each}
    {:else}
      {#if range[0] !== 1}
        <li class={slotListItem()}>
          <a class={slotLink()} href="?p=1">1</a>
        </li>
        {#if range[0] > 2}
          <li class={slotListItem()}>
            <span class={slotSpacer()}>…</span>
          </li>
        {/if}
      {/if}

      {#each range as i}
        <li class={slotListItem()}>
          {#if i === currentPage}
            <span class={slotCurrent()}>{i}</span>
          {:else}
            <a class={slotLink()} href="?p={i}">{i}</a>
          {/if}
        </li>
      {/each}

      {#if range[range.length - 1] < totalPages - 2}
        <li class={slotListItem()}>
          <span class={slotSpacer()}>…</span>
        </li>
        <li class={slotListItem()}>
          <a class={slotLink()} href="?p={totalPages}">{totalPages}</a>
        </li>
      {/if}
    {/if}

    {#if currentPage < totalPages}
      <li class={slotListItem()}>
        <a class={slotLink()} href="?p={currentPage + 1}">
          <IconSprite icon={iconNext} />
        </a>
      </li>
    {/if}
  </ul>
</nav>
