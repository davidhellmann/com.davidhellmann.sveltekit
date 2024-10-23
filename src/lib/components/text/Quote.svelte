<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Link from "$components/text/Link.svelte";
  import type { Hyper_DataFragment } from "$graphql/graphql";

  const tvQuote = tv({
    slots: {
      slotWrapper: "flex flex-col stack-8 py-16",
      slotQuote: `
        text-5xl text-balance font-serif font-bold md:!leading-[0.9]
        text-neutral-700 relative z-10
        after:absolute after:left-0 after:top-24 after:w-56 after:h-full after:bg-neutral-300 after:-translate-x-1/3 after:z-behind
      `,
      slotSource: "text-lg text-olkch-green relative z-10",
      slotSourceLink: "",
    }
  });

  type QuoteProps = {
    compName?: string;
    className?: string;
    quote: string;
    source?: string;
    link?: Hyper_DataFragment | undefined;
  } & VariantProps<typeof tvQuote>;

  const {
    compName = "Quote",
    className,
    quote,
    source,
    link
  }: QuoteProps = $props();

  const { slotWrapper, slotQuote, slotSource, slotSourceLink } = tvQuote({ className });
</script>

{#if quote}
  <div
    data-comp={compName}
    class={slotWrapper({ className })}
  >
    <blockquote class={slotQuote()}>
      <p>{quote}</p>
    </blockquote>
    {#if source}
      <p class={slotSource()}>
        {#if !link}
          {source}
        {:else if (link?.url)}
          <Link
            href={link.url}
            text={source ?? link.text}
            icon="arrow-right-outline"
            variant={link.linkStyle}
            className={slotSourceLink()}
          />
        {/if}
      </p>
    {/if}
  </div>
{/if}
