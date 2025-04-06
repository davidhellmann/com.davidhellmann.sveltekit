<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";

  const tvHeroBlog = tv({
    slots: {
      slotWrapper: "stack-4 span-xl",
      slotHeadline: "max-w-[20ch] text-5xl"
    }
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

  const { compName = "HeroBlog", className, headline, backButton }: HeroBlogProps = $props();

  const { slotWrapper, slotHeadline } = tvHeroBlog();
</script>

{#if headline}
  <header data-comp={compName} class={slotWrapper({ className })}>
    <a href="/blog">←</a>
    {#if backButton?.title}
      <a href={backButton?.url}>{backButton?.title}</a>
    {/if}
    <Headline text={headline} tag="h1" className={slotHeadline()} />
  </header>
{/if}
