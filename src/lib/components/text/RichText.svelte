<script lang="ts">
  import { tv, type VariantProps } from "$utils/classNames";
  import type { HTMLAttributes } from "svelte/elements";

  const tvRichText = tv({
    base: "stack-4"
  });

  type RichTextProps = {
    compName?: string;
    className?: string;
    html?: string;
  } & VariantProps<typeof tvRichText> &
    HTMLAttributes<HTMLDivElement>;

  const { compName = "RichText", className, html, ...rest }: RichTextProps = $props();
</script>

{#if html}
  <div data-comp={compName} class={tvRichText({ className })} {...rest}>
    <!-- eslint-disable-next-line -->
    {@html html}
  </div>
{/if}

<style>
  @reference "../../styles/app.css";
  :global([data-comp="RichText"] :is(h2, h3, h4, h5, h6)) {
    font-weight: var(--font-weight-extrabold);
    padding-top: 2cap;
    line-height: var(--line-height-tight);
  }

  :global([data-comp="RichText"] h2) {
    font-size: var(--text-3xl);
  }

  :global([data-comp="RichText"] h3) {
    font-size: var(--text-xl);
  }

  :global([data-comp="RichText"] h4) {
    font-size: var(--text-xl);
  }

  :global([data-comp="RichText"] h5) {
    font-size: var(--text-lg);
  }

  :global([data-comp="RichText"] h6) {
    font-size: var(--text-base);
  }

  :global([data-comp="RichText"] :is(ul)) {
    list-style-type: disc;
    list-style-position: inside;

    & li {
      padding-left: --spacing(8);
    }

    & li::marker {
      color: var(--color-neon-orange);
    }
  }

  :global([data-comp="RichText"] :is(ol)) {
    counter-reset: item;
    list-style-position: inside;

    & li {
      padding-left: --spacing(8);
    }

    & li::before {
      color: var(--color-neon-orange);
      padding-right: --spacing(4);
      content: counters(item, ".") ".";
      counter-increment: item;
    }
  }

  :global([data-comp="RichText"] mark) {
    padding: --spacing(0.5) --spacing(1.5);

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
    margin: 0 --spacing(0.5);
    font-size: 0.7em;
    border-radius: var(--rounded-sm);

    &.light {
      background-color: var(--color-neutral-200);
      color: var(--color-neutral-500);
      border: 1px solid var(--color-neutral-400);
      box-shadow:
        0 1px 0 var(--color-neutral-300),
        inset 0 1px 0 var(--color-neutral-50);
    }

    &.dark {
      background-color: var(--color-neutral-800);
      color: var(--color-neutral-400);
      border: 1px solid var(--color-neutral-900);
      box-shadow:
        0 1px 0 var(--color-neutral-300),
        inset 0 1px 0 var(--color-neutral-500);
    }
  }

  :global([data-comp="RichText"] a) {
    @apply transition-all;

    text-decoration: underline;
    text-decoration-style: wavy;
    text-underline-offset: 4px;
    text-decoration-color: var(--color-neon-orange);
    color: var(--color-accent-purple-700);
    word-break: break-all;
    display: inline-block;
    position: relative;

    &:hover {
      text-underline-offset: 2px;
    }
  }

  :global(:where([data-theme="dark"]) [data-comp="RichText"] a) {
    color: var(--color-neutral-50);
    text-decoration-color: var(--color-accent-purple-400);
  }

  :global([data-comp="RichText"] code) {
    border: 1px solid var(--color-neutral-300);
    background-color: var(--color-neutral-50);
    color: var(--color-neutral-500);
    padding: --spacing(1.5) --spacing(2) --spacing(1) --spacing(2);
    border-radius: var(--rounded-lg);
    font-size: var(--text-sm);
  }
</style>
