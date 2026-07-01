<script lang="ts">
  import { tv, type VariantProps } from "$utils/classNames";
  import IconSprite from "$components/media/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  const tvPagination = tv({
    slots: {
      slotNav: "flex justify-center text-sm",
      slotList: "flex rounded-md",
      slotListItem: "",
      slotLink: "flex h-full items-center transition",
      slotSpacer: "flex",
      slotCurrent: "flex"
    },
    variants: {
      theme: {
        default: {
          slotList: "bg-neutral-100 shadow-neutral-400 shadow-xs",
          slotListItem: "[&:not(:last-child)]:border-e-1 [&:not(:last-child)]:border-e-neutral-200",
          slotLink: "hover:bg-neutral-50 px-4 pt-3 pb-2",
          slotSpacer: "px-4 pt-3 pb-2 text-neutral-400",
          slotCurrent:
            "px-4 relative pt-3 pb-2 after:size-2 after:bg-accent-purple-400 after:rounded-full after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:translate-y-4"
        },
        photos: {
          slotList: "bg-white gap-1",
          slotListItem: "",
          slotLink: "hover:bg-neutral-100 rounded-full size-10 justify-center",
          slotSpacer: "text-neutral-400 border-b-0 rounded-full",
          slotCurrent: "bg-[red] text-white rounded-full size-10 justify-center items-center"
        }
      },
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
    className = "",
    totalPages,
    currentPage = 1,
    iconPrev = "arrow-left-outline",
    iconNext = "arrow-right-outline",
    simple = false,
    uri,
    yPosition,
    xPosition,
    theme = "default"
  }: PaginationProps = $props();

  const getPageRange = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const pageHref = (pageNumber: number) => `${uri}/${pageNumber}`;
  const allPages = $derived(getPageRange(1, totalPages));
  const visiblePages = $derived(getPageRange(Math.max(1, currentPage - 2), Math.min(totalPages, currentPage + 2)));

  const { slotNav, slotList, slotListItem, slotLink, slotCurrent, slotSpacer } = tvPagination({
    xPosition,
    yPosition,
    theme
  });
</script>

<nav class="{slotNav()} {className}" data-comp={compName}>
  <ul class={slotList()}>
    {#if currentPage > 1}
      <li class={slotListItem()}>
        <a class={slotLink()} href={pageHref(currentPage - 1)}>
          <IconSprite icon={iconPrev} />
        </a>
      </li>
    {/if}

    {#if simple}
      <li class={slotListItem()}>
        <span class={`${slotCurrent()} border-transparent after:hidden`}>{currentPage} / {totalPages}</span>
      </li>
    {:else if totalPages <= 6}
      {#each allPages as pageNumber (pageNumber)}
        <li class={slotListItem()}>
          {#if pageNumber === currentPage}
            <span class={slotCurrent()}>{pageNumber}</span>
          {:else}
            <a class={slotLink()} href={pageHref(pageNumber)}>{pageNumber}</a>
          {/if}
        </li>
      {/each}
    {:else}
      {#if visiblePages[0] !== 1}
        <li class={`${slotListItem()} hidden sm:block`}>
          <a class={slotLink()} href={uri}>1</a>
        </li>
        {#if visiblePages[0] > 2}
          <li class={`${slotListItem()} hidden sm:block`}>
            <span class={slotSpacer()}>…</span>
          </li>
        {/if}
      {/if}

      {#each visiblePages as pageNumber (pageNumber)}
        <li class={`${slotListItem()} hidden sm:block`}>
          {#if pageNumber === currentPage}
            <span class={slotCurrent()}>{pageNumber}</span>
          {:else}
            <a class={slotLink()} href={pageHref(pageNumber)}>{pageNumber}</a>
          {/if}
        </li>
      {/each}

      <li class={`${slotListItem()} sm:hidden`}>
        <span class={`${slotCurrent()} border-transparent`}>{currentPage} / {totalPages}</span>
      </li>

      {#if visiblePages[visiblePages.length - 1] < totalPages - 2}
        <li class={`${slotListItem()} hidden sm:block`}>
          <span class={slotSpacer()}>…</span>
        </li>
        <li class={`${slotListItem()} hidden sm:block`}>
          <a class={slotLink()} href={pageHref(totalPages)}>{totalPages}</a>
        </li>
      {/if}
    {/if}

    {#if currentPage < totalPages}
      <li class={slotListItem()}>
        <a class={slotLink()} href={pageHref(currentPage + 1)}>
          <IconSprite icon={iconNext} />
        </a>
      </li>
    {/if}
  </ul>
</nav>
