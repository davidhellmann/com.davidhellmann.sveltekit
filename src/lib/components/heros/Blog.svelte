<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import IconSprite from "$components/media/IconSprite.svelte";

  const tvHeroBlog = tv({
    slots: {
      slotWrapper: "stack-12 span-xl",
      slotBack: "flex items-center gap-3 group font-mono text-sm text-neutral-500",
      slotIcon:
        "text-white bg-neutral-300 text-neutral-500 group-hover:text-white group-hover:bg-accent-purple-700 transition rounded-full size-8 p-2 gap3",
      slotHeadline: "max-w-[20ch] text-5xl",
      slotMeta: "border-y py-3 border-dashed border-neutral-400 flex flex-col font-mono text-xs stack-1",
      slotList: "flex flex-wrap items-baseline",
      slotLabel: "uppercase font-bold tracking-widest text-neutral-500",
      slotLink: "uppercase font-bold tracking-widest text-accent-purple-700 transition hover:text-accent-purple-500"
    }
  });

  type HeroBlogProps = {
    compName?: string;
    className?: string;
    headline?: string;
    backButton?: {
      title?: string;
      url?: string;
    };
    category?: {
      title?: string;
      url?: string;
    }[];
    topics?: {
      title?: string;
      url?: string;
    }[];
  } & VariantProps<typeof tvHeroBlog>;

  const { compName = "HeroBlog", className, headline, category, topics, backButton }: HeroBlogProps = $props();

  const { slotWrapper, slotMeta, slotList, slotLabel, slotLink, slotBack, slotIcon, slotHeadline } = tvHeroBlog();
</script>

{#if headline}
  <header data-comp={compName} class={slotWrapper({ className })}>
    {#if backButton?.url && backButton?.title}
      <a class={slotBack()} href={backButton?.url}>
        <IconSprite icon="arrow-left-outline" size={20} className={slotIcon()} />
        {backButton?.title}
      </a>
    {/if}
    <Headline text={headline} tag="h1" className={slotHeadline()} />
    {#if (category && category.length > 0) || (topics && topics.length > 0)}
      <div class={slotMeta()}>
        {#if category && category.length > 0}
          <ul class={slotList()}>
            <li class={slotLabel()}>category:&nbsp;</li>
            {#each category as cat, i (cat.url)}
              <li>
                <a class={slotLink()} href={cat.url}>{cat.title}</a>{#if i < category.length - 1},&nbsp;{/if}
              </li>
            {/each}
          </ul>
        {/if}

        {#if topics && topics.length > 0}
          <ul class={slotList()}>
            <li class={slotLabel()}>topics:&nbsp;</li>
            {#each topics as topic, i (topic.url)}
              <li>
                <a class={slotLink()} href={topic.url}>{topic.title}</a>{#if i < topics.length - 1},&nbsp;{/if}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}
  </header>
{/if}
