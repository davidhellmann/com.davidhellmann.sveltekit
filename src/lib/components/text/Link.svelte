<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/ui/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  type Icon = HeroiconsIcons | undefined;

  // transition: all theme("transitionDuration.DEFAULT") theme("transitionTimingFunction.in-out");
  //
  // &:hover {
  //   text-underline-offset: theme("textUnderlineOffset.2");
  // }

  const tvLink = tv({
    base: "inline-flex items-center transition font-semibold [&_svg]:shrink-0 text-pretty transition-all",
    variants: {
      variant: {
        primary: "",
        secondary: "",
        outline: "",
        inline: `
          underline decoration-wavy underline-offset-4 text-accent-purple-700 decoration-olkch-orange
          hover:underline-offset-2 group-hover:underline-offset-2
        `,
      },
      iconPosition: {
        left: "[&_svg]:-ml-2 flex-row-reverse",
        right: "[&_svg]:-mr-2 flex-row",
        only: "[&_svg]:-mx-2",
      },
      gapSize: {
        2: "gap-2 hover:gap-4",
        4: "gap-4 hover:gap-6",
        8: "gap-8 hover:gap-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      iconPosition: "left",
      gapSize: 4,
    },
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
  <IconSprite icon={icon} size={"relative"} />
{/snippet}

{#if href && (text || icon)}
  <svelte:element
    this={fakeLink ? "div" : "a"}
    data-comp={compName}
    href="{fakeLink ? undefined : href}"
    class={tvLink({ variant, iconPosition, gapSize, className })}
    {...rest}>
    {#if icon}{@render iconSnippet()}{/if}
    {text}
  </svelte:element>
{/if}
