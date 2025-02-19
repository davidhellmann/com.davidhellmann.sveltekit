<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/media/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  type Icon = HeroiconsIcons | undefined;

  const tvLink = tv({
    base: "inline-flex text-sm items-center transition font-mono font-semibold [&_svg]:shrink-0 text-pretty transition-all",
    variants: {
      variant: {
        primary: `
          bg-gradient-to-b from-neutral-800 to-neutral-700 text-neutral-200
          px-5 py-3 rounded-full border border-neutral-700 ring-2 ring-neutral-900 shadow-md shadow-neutral-900
          transition-all
          hover:border-neutral-600 hover:shadow-none
          group-hover:border-neutral-600 group-hover:shadow-none
        `,
        secondary: `
          bg-gradient-to-b from-neutral-200 to-neutral-50
          px-5 py-3 rounded-full border border-neutral-50 ring-2 ring-neutral-300 shadow-md shadow-neutral-900/50
          text-accent-purple-900/70
          transition-all
          hover:border-white hover:shadow-none
          group-hover:border-white group-hover:shadow-none
        `,
        outline: `
          px-5 py-3 rounded-full border-2 border-neutral-50 ring-2 ring-neutral-50
          hover:border-neutral-50/80 hover:ring-neutral-50/80
          group-hover:border-neutral-50/80 group-hover:ring-neutral-50/80
        `,
        inline: `
          underline decoration-wavy underline-offset-4 text-accent-purple-700 decoration-neon-orange
          hover:underline-offset-2 group-hover:underline-offset-2
        `
      },
      iconPosition: {
        left: "[&_svg]:-mr-2 flex-row",
        right: "[&_svg]:-ml-2 flex-row-reverse",
        only: "[&_svg]:-mx-2"
      },
      gapSize: {
        2: "gap-2",
        4: "gap-4",
        8: "gap-8"
      }
    },
    defaultVariants: {
      variant: "primary",
      gapSize: 4
    }
  });

  type LinkProps = {
    compName?: string;
    className?: string;
    text?: string;
    href: string;
    icon?: Icon;
    fakeLink?: boolean;
  } & VariantProps<typeof tvLink>;

  let {
    compName = "Link",
    className,
    text,
    href,
    fakeLink,
    icon,
    iconPosition,
    gapSize,
    variant,
    ...rest
  }: LinkProps = $props();

  if (!text && icon) {
    iconPosition = "only";
  }
</script>

{#snippet iconSnippet()}
  <IconSprite {icon} size={"relative"} />
{/snippet}

{#if href && (text || icon)}
  <svelte:element
    this={fakeLink ? "div" : "a"}
    data-comp={compName}
    href={fakeLink ? undefined : href}
    class={tvLink({ variant, iconPosition, gapSize, className })}
    {...rest}
  >
    {#if icon}{@render iconSnippet()}{/if}
    {text}
  </svelte:element>
{/if}
