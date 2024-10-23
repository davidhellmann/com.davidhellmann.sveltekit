<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvRichText = tv({
    base: "stack-4",
  });

  type RichTextProps = {
    compName?: string;
    className?: string;
    html: string;
  } & VariantProps<typeof tvRichText>;

  const {
    compName = "RichText",
    className,
    html,
    ...rest
  }: RichTextProps = $props();

</script>

{#if html}
  <div
    data-comp={compName}
    class={tvRichText({ className })}
    {...rest}
  >
    {@html html}
  </div>
{/if}

<style lang="postcss">
  :global([data-comp="RichText"] :is(h2, h3, h4, h5, h6)) {
    font-weight: theme("fontWeight.extrabold");
    line-height: theme("lineHeight.tight");
    color: theme("colors.neutral.500");
    padding-top: 2cap;
  }

  :global([data-comp="RichText"] h2) {
    font-size: theme("fontSizeFluid.3xl");
  }

  :global([data-comp="RichText"] h3) {
    font-size: theme("fontSizeFluid.2xl");
  }

  :global([data-comp="RichText"] h4) {
    font-size: theme("fontSizeFluid.xl");
  }

  :global([data-comp="RichText"] h5) {
    font-size: theme("fontSizeFluid.lg");
  }

  :global([data-comp="RichText"] h6) {
    font-size: theme("fontSizeFluid.base");
  }

  :global([data-comp="RichText"] :is(ul)) {
    list-style-type: disc;
    list-style-position: inside;

    & li {
      padding-left: theme("spacing.8");
    }

    & li::marker {
      color: theme("colors.olkch.orange");
    }
  }

  :global([data-comp="RichText"] :is(ol)) {
    counter-reset: item;
    list-style-position: inside;

    & li {
      padding-left: theme("spacing.8");
    }

    & li::before {
      color: theme("colors.olkch.orange");
      content: counters(item, ".") ".";
      counter-increment: item;
      margin-right: theme("spacing.4");
    }
  }

  :global([data-comp="RichText"] mark) {
    padding: theme("spacing[0.5]") theme("spacing[1.5]");

    &.green {
      background-color: #bdf8b5;
      color: #0f8c00;
    }

    &.yellow {
      background-color: #f8f2b5;
      color: #796c00;
    }

    &.red {
      background-color: #fdc5c5;
      color: #8c0000;
    }
  }

  :global([data-comp="RichText"] kbd) {
    padding: 0.25em 0.5em;
    margin: 0 theme("spacing[0.5]");
    font-size: 0.7em;
    border-radius: theme("borderRadius.DEFAULT");

    &.light {
      background-color: theme("colors.neutral.200");
      color: theme("colors.neutral.500");
      border: theme("borderWidth.DEFAULT") solid theme("colors.neutral.400");
      box-shadow: 0 1px 0 theme("colors.neutral.300"), inset 0 1px 0 theme("colors.neutral.50");
    }

    &.dark {
      background-color: theme("colors.neutral.800");
      color: theme("colors.neutral.400");
      border: theme("borderWidth.DEFAULT") solid theme("colors.neutral.900");
      box-shadow: 0 1px 0 theme("colors.neutral.300"), inset 0 1px 0 theme("colors.neutral.500");
    }
  }

  :global([data-comp="RichText"] a) {
    position: relative;
    display: inline-block;
    text-decoration: underline;
    text-decoration-style: wavy;
    text-underline-offset: theme("textUnderlineOffset.4");
    color: theme("colors.accent-purple.700");
    text-decoration-color: theme("colors.olkch.orange");
    transition: all theme("transitionDuration.DEFAULT") theme("transitionTimingFunction.in-out");

    &:hover {
      text-underline-offset: theme("textUnderlineOffset.2");
    }
  }

  :global([data-comp="RichText"] code) {
    border: theme("borderWidth.DEFAULT") solid theme("colors.neutral.300");
    background-color: theme("colors.neutral.50");
    color: theme("colors.neutral.500");
    padding: theme("spacing[1.5]") theme("spacing.2") theme("spacing.1") theme("spacing.2");
    border-radius: theme("borderRadius.lg");
    font-size: theme("fontSizeFluid.sm");
  }
</style>
