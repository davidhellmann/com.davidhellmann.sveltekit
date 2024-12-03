<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvRichText = tv({
    base: "stack-4"
  });

  type RichTextProps = {
    compName?: string;
    className?: string;
    html: string;
  } & VariantProps<typeof tvRichText>;

  const { compName = "RichText", className, html, ...rest }: RichTextProps = $props();
</script>

{#if html}
  <div data-comp={compName} class={tvRichText({ className })} {...rest}>
    <!-- eslint-disable-next-line -->
    {@html html}
  </div>
{/if}

<style lang="postcss">
  :global([data-comp="RichText"] :is(h2, h3, h4, h5, h6)) {
    @apply font-extrabold leading-tight pt-[2cap];
  }

  :global([data-comp="RichText"] h2) {
    @apply text-3xl;
  }

  :global([data-comp="RichText"] h3) {
    @apply text-2xl;
  }

  :global([data-comp="RichText"] h4) {
    @apply text-xl;
  }

  :global([data-comp="RichText"] h5) {
    @apply text-lg;
  }

  :global([data-comp="RichText"] h6) {
    @apply text-base;
  }

  :global([data-comp="RichText"] :is(ul)) {
    list-style-type: disc;
    list-style-position: inside;

    & li {
      @apply pl-8;
    }

    & li::marker {
      @apply text-olkch-orange;
    }
  }

  :global([data-comp="RichText"] :is(ol)) {
    counter-reset: item;
    list-style-position: inside;

    & li {
      @apply pl-8;
    }

    & li::before {
      @apply text-olkch-orange pr-4;
      content: counters(item, ".") ".";
      counter-increment: item;
    }
  }

  :global([data-comp="RichText"] mark) {
    @apply py-0.5 px-1.5;

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
    @apply py-[0.25em] px-[0.5em] my-0 mx-0.5 text-[0.7em] rounded;

    &.light {
      @apply bg-neutral-200 text-neutral-500 border-neutral-400 border;
      box-shadow:
        0 1px 0 theme("colors.neutral.300"),
        inset 0 1px 0 theme("colors.neutral.50");
    }

    &.dark {
      @apply bg-neutral-800 text-neutral-400 border-neutral-900 border;
      box-shadow:
        0 1px 0 theme("colors.neutral.300"),
        inset 0 1px 0 theme("colors.neutral.500");
    }
  }

  :global([data-comp="RichText"] a) {
    @apply underline decoration-wavy break-all inline-block relative
    underline-offset-4 decoration-olkch-orange text-accent-purple-700 transition-all ease-in-out;

    &:hover {
      @apply underline-offset-2;
    }
  }

  :global([data-theme="dark"] [data-comp="RichText"] a) {
    @apply text-neutral-50 decoration-accent-purple-400;
  }

  :global([data-comp="RichText"] code) {
    @apply border border-neutral-300 bg-neutral-50 text-neutral-500 px-2 pt-1.5 pb-1 rounded-lg text-sm;
  }
</style>
