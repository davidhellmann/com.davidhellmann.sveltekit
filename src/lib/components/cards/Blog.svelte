<script lang="ts">
  import { tv, type VariantProps } from "$lib/utils/classNames";
  import Headline from "$components/text/Headline.svelte";
  import Category from "$components/text/Category.svelte";
  import Time from "$components/text/Time.svelte";
  import PlainText from "$components/text/PlainText.svelte";
  import Link from "$components/text/Link.svelte";

  const tvCardBlog = tv({
    slots: {
      slotBase:
        "@container group text-neutral-50 px-8 md:px-10 pt-12 pb-20 rounded-3xl flex flex-col items-start stack-4 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 transform-gpu",
      slotMeta: "flex flex-col @sm:flex-row @sm:items-center flex-wrap gap-x-6",
      slotCategory: "",
      slotFakeLink:
        "transition absolute ease-out duration-300 right-6 -bottom-0 opacity-0 translate-y-1/2 group-hover:-translate-y-1/2 group-hover:opacity-100"
    },
    variants: {
      theme: {
        high: {
          slotBase: "bg-accent-purple-600 md:px-16 md:py-20 border-4 border-accent-purple-50/20"
        },
        middle: {
          slotBase: "bg-accent-purple-500 md:px-16 md:py-20 border-4 border-accent-purple-50/20"
        },
        low: {
          slotBase: "bg-accent-purple-400 md:px-16 md:py-20 border-4 border-accent-purple-50/20"
        },
        default: {
          slotBase: "bg-neutral-300/50 text-neutral-500 border-4 border-neutral-200"
        },
        dark: {
          slotBase: "bg-neutral-950/60 border-2 border-neutral-800/50 shadow-lg text-neutral-100"
        }
      },
      size: {
        large: "",
        default: ""
      }
    },
    defaultVariants: {
      theme: "default",
      size: "default"
    }
  });

  type CardBlogProps = {
    compName?: string;
    className?: string;
    headline: string;
    url: string;
    categoryTitle: string;
    postDate: string;
    descriptionPlain?: string;
  } & VariantProps<typeof tvCardBlog>;

  let {
    compName = "CardBlog",
    className,
    headline,
    url,
    categoryTitle,
    postDate,
    descriptionPlain,
    theme,
    size
  }: CardBlogProps = $props();

  const { slotBase, slotMeta, slotCategory, slotFakeLink } = tvCardBlog({ theme, className });
</script>

{#if headline && url}
  <a href={url} class={slotBase({ theme, className })} data-comp={compName} data-waypoint-target>
    <div class={slotMeta()}>
      <Category className={slotCategory({})} title={categoryTitle} />
      <Time timestamp={postDate} />
    </div>
    {#if theme}
      <Headline preset={size === "large" ? "h1" : "h5"} text={headline} className="max-w-[22ch]" />
    {/if}
    {#if descriptionPlain}
      <PlainText text={descriptionPlain} className={"line-clamp-3"} />
    {/if}
    <Link
      className={slotFakeLink()}
      href={url}
      text="This way!"
      fakeLink={true}
      variant="secondary"
      icon="arrow-right-outline"
      iconPosition="right"
    />
  </a>
{/if}
