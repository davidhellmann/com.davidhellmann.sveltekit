<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";

  const tvHeroBlog = tv({
    slots: {
      slotWrapper: "fluid-grid content-end min-h-[50vh]",
      slotContent: "span-content pb-36 pt-48 stack-12",
      slotHeadline: "",
    },
  });

  type HeroBlogProps = {
    compName?: string;
    className?: string;
    headline: string;
    backButton?: {
      title?: string;
      url?: string;
    };
  } & VariantProps<typeof tvHeroBlog>;

  const {
    compName = "HeroBlog",
    className,
    headline,
    backButton
  }: HeroBlogProps = $props();

  const {slotWrapper, slotContent, slotHeadline} = tvHeroBlog();
</script>

{#if headline}
  <header
    data-comp={compName}
    class={slotWrapper({ className })}
  >
    <div class={slotContent()}>
      <a href="/blog">←</a>
      {#if backButton?.title}
        <a href={backButton?.url}>{backButton?.title}</a>
      {/if}
      <Headline text={headline} tag="h1" preset="h1" className={slotHeadline()}/>
    </div>
  </header>
{/if}
