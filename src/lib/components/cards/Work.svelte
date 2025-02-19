<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import Time from "$components/text/Time.svelte";
  import PlainText from "$components/text/PlainText.svelte";
  import { stripTags } from "$utils/stripTags";
  import { onMount } from "svelte";


  const tvCardWork = tv({
    slots: {
      slotBase: "@container text-neutral-50 px-8 md:px-10 py-12 md:py-12 rounded-3xl flex flex-col items-start stack-4 transition-all ",
      slotMeta: "flex flex-col @sm:flex-row @sm:items-center flex-wrap gap-x-6",
    },
    variants: {
      theme: {
        dark: {
          slotBase: "bg-neutral-950/60 border-2 border-neutral-800/50 shadow-lg text-neutral-100",
        }
      }
    },
    defaultVariants: {
      theme: "dark"
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
  <a href={url} class={slotBase({ theme, className })} data-comp={compName} data-waypoint-target>
    <div class={slotMeta()}>
      <Time timestamp={postDate} />
    </div>
    <Headline
      preset={"h5"}
      text={headline}
      className="max-w-[22ch]"
    />
    {#if description}
      <PlainText text={description} className={"line-clamp-3"} />
    {/if}
  </a>
{/if}


