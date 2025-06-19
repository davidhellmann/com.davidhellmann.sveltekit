<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/media/IconSprite.svelte";
  import type { Entry_DataFragment } from "$graphql/graphql";

  const tvPrevNext = tv({
    slots: {
      slotNav: "flex justify-between items-center gap-8 mt-16 mb-24",
      slotLink: "group flex items-center gap-3 text-sm font-mono transition-all hover:gap-4",
      slotIcon: "shrink-0",
      slotText: "flex flex-col",
      slotLabel: "text-xs text-neutral-500 uppercase tracking-wide",
      slotTitle: "font-semibold"
    },
    variants: {
      theme: {
        default: {
          slotLink: "hover:text-accent-purple-700",
          slotIcon: "text-neutral-400 group-hover:text-accent-purple-700"
        },
        photos: {
          slotLink: "hover:text-black",
          slotIcon: "text-neutral-600 group-hover:text-black"
        }
      }
    },
    defaultVariants: {
      theme: "default"
    }
  });

  type Variants = VariantProps<typeof tvPrevNext>;

  interface Props extends Variants {
    prev?: Entry_DataFragment | null;
    next?: Entry_DataFragment | null;
    compName?: string;
    className?: string;
  }

  let {
    prev = null,
    next = null,
    theme = "default",
    compName = "PrevNext",
    className = ""
  }: Props = $props();

  const { slotNav, slotLink, slotIcon, slotText, slotLabel, slotTitle } = tvPrevNext({ theme });
</script>

<nav data-comp={compName} class="{slotNav()} {className}">
  {#if prev}
    <a href="/{prev.uri}" class={slotLink()}>
      <IconSprite icon="arrow-left-outline" size="sm" className={slotIcon()} />
      <span class={slotText()}>
        <span class={slotLabel()}>Previous</span>
        <span class={slotTitle()}>{prev.title}</span>
      </span>
    </a>
  {:else}
    <div></div>
  {/if}

  {#if next}
    <a href="/{next.uri}" class="{slotLink()} flex-row-reverse">
      <IconSprite icon="arrow-right-outline" size="sm" className={slotIcon()} />
      <span class="{slotText()} text-end">
        <span class={slotLabel()}>Next</span>
        <span class={slotTitle()}>{next.title}</span>
      </span>
    </a>
  {:else}
    <div></div>
  {/if}
</nav>