<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import PlainText from "$components/text/PlainText.svelte";
  // import Link from "$components/text/Link.svelte";

  const tvCaption = tv({
    slots: {
      slotFigcaption: "flex flex-col gap-1",
      slotHeadline: "",
      slotText: "",
      slotSource: "font-semibold",
      textSize: ""
    },
    variants: {
      size: {
        sm: {
          textSize: "text-xs"
        },
        base: {
          textSize: "text-base"
        }
      }
    }
  });

  type CaptionTags = "figcaption" | "div";

  type FigcaptionProps = {
    compName?: string;
    className?: string;
    headline?: string | undefined;
    text: string;
    tag?: CaptionTags,
    source?: string | undefined;
    sourceUrl?: string | undefined;
  } & VariantProps<typeof tvCaption>;

  const {
    compName = "Caption",
    className,
    size = "sm",
    headline,
    text,
    tag = "figcaption",
    source,
    sourceUrl
  }: FigcaptionProps = $props();

  const { slotFigcaption, slotHeadline, slotText, slotSource, textSize } = tvCaption({ size });
</script>


{#if text}
  <svelte:element this={tag}
    data-comp={compName}
    class={`${slotFigcaption({ size, className })} ${textSize()}`}
  >
    {#if headline}
      <Headline
        text={headline}
        tag={"h3"}
        size={size}
        weight={"semibold"}
        className={slotHeadline()}
      />
    {/if}

    <PlainText
      className={slotText()}
      text={text}
    />

    {#if source && !sourceUrl}
      <PlainText className={slotSource()} text={source} />
    {/if}

    <!-- TODO: Add Link Component -->
    <!--{#if source && sourceUrl}-->
    <!--  <Link-->
    <!--    variant={"inlineSecondary"}-->
    <!--    icon={"heroicon/arrow-right-outline"}-->
    <!--    text={source}-->
    <!--    href={sourceUrl}-->
    <!--  />-->
    <!--{/if}-->
  </svelte:element>
{/if}
