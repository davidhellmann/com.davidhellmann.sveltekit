<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import Category from "$components/text/Category.svelte";
  import Time from "$components/text/Time.svelte";
  import PlainText from "$components/text/PlainText.svelte";
  import { stripTags } from "$utils/stripTags";
  import { onMount } from "svelte";


  const tvCardBlog = tv({
    slots: {
      slotBase: "@container text-neutral-50 px-8 md:px-16 py-12 md:py-20 rounded-3xl flex flex-col items-start stack-4 transition-all ",
      slotMeta: "flex flex-col @sm:flex-row @sm:items-center flex-wrap gap-x-6",
      slotCategory: ""
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
        }
      }
    },
    defaultVariants: {
      theme: "default"
    }
  });

  type CardBlogProps = {
    compName?: string;
    className?: string;
    headline: string;
    url: string;
    categoryTitle: string;
    postDate: string;
    description?: string;
  } & VariantProps<typeof tvCardBlog>;

  let {
    compName = "CardBlog",
    className,
    headline,
    url,
    categoryTitle,
    postDate,
    description,
    theme
  }: CardBlogProps = $props();

  onMount(() => {
    if (description && document) {
      description = stripTags(description);
    }
  });

  const { slotBase, slotMeta, slotCategory } = tvCardBlog({ theme, className });
</script>

{#if headline && url}
  <a href={url} class={slotBase({ theme, className })} data-comp={compName}>
    <div class={slotMeta()}>
      <Category className={slotCategory({})} title={categoryTitle} />
      <Time timestamp={postDate} />
    </div>
    <Headline
      preset={theme !== "default" ? "h1" : "h4"}
      text={headline}
      className="max-w-[22ch]"
    />
    {#if description}
      <PlainText text={description} className={"line-clamp-3"} />
    {/if}
  </a>
{/if}


