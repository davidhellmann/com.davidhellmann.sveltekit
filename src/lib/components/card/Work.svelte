<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import Time from "$components/text/Time.svelte";
  import PlainText from "$components/text/PlainText.svelte";
  import { stripTags } from "$utils/stripTags";
  import { onMount } from "svelte";


  const tvCardWork = tv({
    slots: {
      slotBase: "@container text-neutral-50 px-8 md:px-16 py-12 md:py-20 rounded-3xl flex flex-col items-start stack-4 transition-all ",
      slotMeta: "flex flex-col @sm:flex-row @sm:items-center flex-wrap gap-x-6",
    },
    variants: {
      theme: {
        high: {
          slotBase: "bg-accent-purple-600",
        },
        middle: {
          slotBase: "bg-accent-purple-500",
        },
        low: {
          slotBase: "bg-accent-purple-400",
        },
        default: {
          slotBase: "bg-neutral-300/50 text-neutral-500",
        },
        dark: {
          slotBase: "bg-neutral-950/60 border-2 border-neutral-800/50 shadow-lg text-neutral-100",
        }
      }
    },
    defaultVariants: {
      theme: "default"
    }
  });

  type CardWorkProps = {
    compName?: string;
    className?: string;
    headline: string;
    url: string;
    postDate: string;
    description?: string;
  } & VariantProps<typeof tvCardWork>;

  let {
    compName = "CardWork",
    className,
    headline,
    url,
    postDate,
    description,
    theme
  }: CardWorkProps = $props();

  onMount(() => {
    if (description && document) {
      description = stripTags(description);
    }
  });

  const { slotBase, slotMeta } = tvCardWork({ theme, className });
</script>

{#if headline && url}
  <a href={url} class={slotBase({ theme, className })} data-comp={compName}>
    <div class={slotMeta()}>
      <Time timestamp={postDate} />
    </div>
    {#if theme}
      <Headline
        preset={["high", "middle", "low"].includes(theme) ? "h1" : "h5"}
        text={headline}
        className="max-w-[22ch]"
      />
    {/if}
    {#if description}
      <PlainText text={description} className={"line-clamp-3"} />
    {/if}
  </a>
{/if}


