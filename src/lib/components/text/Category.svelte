<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/media/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  const tvCategory = tv({
    base: "flex items-center gap-2 font-mono text-sm",
    variants: {
      variant: {
        blog: "",
        work: "bg-neutral-200/50 theme-dark:bg-neutral-950/50 text-current/60 theme-dark:text-current/30 px-2.5 pt-1.5 pb-1 rounded-lg self-start"
      }
    },
    defaultVariants: {
      variant: "blog"
    }
  });

  type CategoryProps = {
    compName?: string;
    className?: string;
    title?: string;
    icon?: HeroiconsIcons;
  } & VariantProps<typeof tvCategory>;

  let { compName = "Category", className, title, variant, icon = "tag-outline" }: CategoryProps = $props();
</script>

{#if title}
  <div data-comp={compName} class={tvCategory({ variant, className })}>
    <IconSprite className="-translate-y-px" {icon} size={"relative"} />
    {title}
  </div>
{/if}
