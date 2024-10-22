<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  type IconSets = "heroicons";

  const tvIconSprite = tv({
    base: "inline-flex",
    variants: {
      size: {
        16: "size-4",
        20: "size-5",
        24: "size-6",
        32: "size-8",
        48: "size-12",
        64: "size-16",
        relative: "[--size:1.65cap] [width:var(--size)] [height:var(--size)] [flex-basis:var(--size)]",
      }
    },
    defaultVariants: {
      size: 20
    }
  });

  type IconSpriteProps = {
    compName?: string;
    className?: string;
    icon?: HeroiconsIcons;
    iconSet?: IconSets;
  } & VariantProps<typeof tvIconSprite>;

  const {
    compName = "IconSprite",
    className,
    icon: iconName,
    iconSet = "heroicons",
    size,
  }: IconSpriteProps = $props();
</script>

{#if iconName}
  <svg
    data-icon-name={iconName}
    data-comp={compName}
    class={tvIconSprite({ size, className })}
    aria-hidden="true"
  >
    <use xlink:href={`/icons/sprites/${iconSet}/sprite.svg#${iconName}`} />
  </svg>
{/if}
