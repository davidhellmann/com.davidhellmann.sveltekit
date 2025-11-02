<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/media/IconSprite.svelte";
  import type { Entry_DataFragment } from "$graphql/graphql";

  const tvPrevNext = tv({
    slots: {
      slotNav: "flex justify-between items-center gap-8 mt-16 mb-24",
      slotLink: "group flex items-center gap-3 text-sm font-mono transition-all leading-[1]",
      slotIcon: "shrink-0 rounded-full size-10 p-3",
      slotText: "flex flex-col",
      slotLabel: "text-2xs text-neutral-500 uppercase tracking-widest",
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
          slotIcon: "text-white bg-black group-hover:bg-[red] transition"
        }
      }
    },
    defaultVariants: {
      theme: "default"
    }
  });

  type PrevNextProps = {
    prev?: Entry_DataFragment;
    next?: Entry_DataFragment;
    compName?: string;
    className?: string;
  } & VariantProps<typeof tvPrevNext>;

  let {
    prev = undefined,
    next = undefined,
    theme = "default",
    compName = "PrevNext",
    className = ""
  }: PrevNextProps = $props();

  const { slotNav, slotLink, slotIcon, slotText, slotLabel, slotTitle } = tvPrevNext({ theme });

  const splitTitle = (title?: string) => {
    return title?.split(" (")?.[0] ?? title;
  };
</script>

<nav data-comp={compName} class="{slotNav()} {className}">
  {#if prev}
    <a href="/{prev.uri}" class={slotLink()}>
      <IconSprite icon="arrow-left-outline" size={20} className={slotIcon()} />
      <span class={slotText()}>
        <span class={slotLabel()}>Previous</span>
        <span class={slotTitle()}>{splitTitle(prev?.title)}</span>
      </span>
    </a>
  {/if}

  {#if next}
    <a href="/{next.uri}" class="{slotLink()} flex-row-reverse">
      <IconSprite icon="arrow-right-outline" size={20} className={slotIcon()} />
      <span class="{slotText()} text-end">
        <span class={slotLabel()}>Next</span>
        <span class={slotTitle()}>{splitTitle(next?.title)}</span>
      </span>
    </a>
  {/if}
</nav>
