<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import Pill from "$components/text/Pill.svelte";

  const tvHeroBlog = tv({
    slots: {
      slotWrapper: "meshGradient fluid-grid content-end min-h-[50vh]",
      slotContent: "span-content text-white pb-36 pt-48  stack-12",
      slotHeadline: "",
    },
  });

  type HeroBlogProps = {
    compName?: string;
    className?: string;
    headline: string;
    category?: {
      title?: string;
      url?: string;
    };
  } & VariantProps<typeof tvHeroBlog>;

  const {
    compName = "HeroBlog",
    className,
    headline,
    category
  }: HeroBlogProps = $props();

  const {slotWrapper, slotContent, slotHeadline} = tvHeroBlog();
  console.log(category);
</script>

{#if headline}
  <header
    data-comp={compName}
    data-testid={compName}
    class={slotWrapper({ className })}
  >
    <div class={slotContent()}>
      {#if category?.title}
        <Pill text={category?.title} url={category?.url} />
      {/if}
      <Headline text={headline} tag="h1" preset="h1" className={slotHeadline()}/>
    </div>
  </header>
{/if}
