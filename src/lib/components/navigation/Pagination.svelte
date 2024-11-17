<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/ui/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  const tvPagination = tv({
    slots: {
      slotNav: "flex justify-center  text-sm",
      slotList: "flex bg-neutral-100 rounded-md overflow-clip shadow-sm shadow-neutral-400",
      slotListItem: "[&:not(:last-child)]:border-r-2 [&:not(:last-child)]:border-e-neutral-200",
      slotLink: "flex px-4 pt-3 pb-2 border-b-4 border-transparent items-center hover:bg-neutral-50 transition",
      slotSpacer: "flex px-4 pt-3 pb-2 border-b-4 border-transparent text-neutral-400",
      slotCurrent: "flex px-4 pt-3 pb-2 border-b-4 border-accent-purple-400"
    },
    variants: {
      yPosition: {
        top: {
          slotNav: "mb-24"
        },
        bottom: {
          slotNav: "mt-24"
        },
        sticky: {
          slotNav: ""
        }
      },
      xPosition: {
        center: {
          slotNav: "justify-center"
        },
        start: {
          slotNav: "justify-start"
        },
        end: {
          slotNav: "justify-end"
        }
      }
    },
    defaultVariants: {
      yPosition: "bottom",
      xPosition: "center"
    }
  });

  type PaginationProps = {
    compName?: string;
    className?: string;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    iconPrev?: HeroiconsIcons;
    iconNext?: HeroiconsIcons;
    simple?: boolean;
    uri: string;
  } & VariantProps<typeof tvPagination>;

  const {
    compName = "Pagination",
    className,
    totalItems,
    totalPages,
    currentPage = 1,
    iconPrev = "arrow-left-outline",
    iconNext = "arrow-right-outline",
    simple = false,
    uri,
    yPosition,
    xPosition
  }: PaginationProps = $props();

  const getRange = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const range = $derived(getRange(Math.max(1, currentPage - 2), Math.min(totalPages, currentPage + 2)));

  const {
    slotNav,
    slotList,
    slotListItem,
    slotLink,
    slotCurrent,
    slotSpacer
  } = tvPagination({ xPosition, yPosition, className });
</script>


<nav class={slotNav({ className })} data-comp={compName}>
  <ul class={slotList()}>
    {#if currentPage > 1}
      <li class={slotListItem()}>
        <a class={slotLink()} href="{uri}/{currentPage - 1}">
          <IconSprite icon={iconPrev} />
        </a>
      </li>
    {/if}

    {#if !simple}
      {#if totalPages <= 6}
        {#each { length: totalPages } as _, index (index)}
          <li class={slotListItem()}>
            <a class={slotLink()} href="{uri}/{index + 1}">{index + 1}</a>
          </li>
        {/each}
      {:else}
        {#if range[0] !== 1}
          <li class={slotListItem()}>
            <a class={slotLink()} href="{uri}">1</a>
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
              <a class={slotLink()} href="{uri}/{i}">{i}</a>
            {/if}
          </li>
        {/each}

        {#if range[range.length - 1] < totalPages - 2}
          <li class={slotListItem()}>
            <span class={slotSpacer()}>…</span>
          </li>
          <li class={slotListItem()}>
            <a class={slotLink()} href="{uri}/{totalPages}">{totalPages}</a>
          </li>
        {/if}
      {/if}
    {/if}

    {#if currentPage < totalPages}
      <li class={slotListItem()}>
        <a class={slotLink()} href="{uri}/{currentPage + 1}">
          <IconSprite icon={iconNext} />
        </a>
      </li>
    {/if}
  </ul>
</nav>
