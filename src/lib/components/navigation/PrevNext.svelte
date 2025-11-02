<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/media/IconSprite.svelte";
  import type { Entry_DataFragment } from "$graphql/graphql";

  const tvPrevNext = tv({
    slots: {
      slotNav:
        "flex justify-center items-center mt-16 mb-24 w-full max-w-2xl mx-auto divide-x divide-neutral-300 border border-neutral-300 rounded-full shadow-xs overflow-hidden",
      slotLink: "group flex items-center gap-4 text-sm font-mono transition w-1/2 p-4 h-full",
      slotIcon: "shrink-0 rounded-full size-12 p-4",
      slotText: "flex flex-col",
      slotLabel: "text-2xs text-neutral-500 uppercase tracking-widest",
      slotTitle: "font-semibold wrap-break-word"
    },
    variants: {
      theme: {
        default: {
          slotNav: "bg-neutral-100 shadow-neutral-400",
          slotLink: "hover:text-black  hover:bg-neutral-50",
          slotIcon: "text-white bg-black group-hover:bg-accent-purple-700 transition"
        },
        photos: {
          slotLink: "hover:text-black  hover:bg-neutral-50",
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
    <a href="/{prev.uri}" class={`${slotLink()} ${!next ? "w-full" : ""}`}>
      <IconSprite icon="arrow-left-outline" size={20} className={slotIcon()} />
      <span class={slotText()}>
        <span class={slotLabel()}>Previous</span>
        <span class={slotTitle()}>{splitTitle(prev?.title)}</span>
      </span>
    </a>
  {/if}

  {#if next}
    <a href="/{next.uri}" class="{`${slotLink()} ${!prev ? 'w-full' : ''}`} flex-row-reverse">
      <IconSprite icon="arrow-right-outline" size={20} className={slotIcon()} />
      <span class="{slotText()} text-end">
        <span class={slotLabel()}>Next</span>
        <span class={slotTitle()}>{splitTitle(next?.title)}</span>
      </span>
    </a>
  {/if}
</nav>
