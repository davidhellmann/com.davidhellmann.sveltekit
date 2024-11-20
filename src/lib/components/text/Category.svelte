<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/ui/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  const tvCategory = tv({
    base: "flex items-center gap-2 font-mono text-sm",
    variants: {
      variant: {
        blog: "",
        work: "bg-neutral-900/10 border border-neutral-100/20 text-current px-2.5 pt-1.5 pb-1 rounded-lg self-start"
      }
    },
    defaultVariants: {
      variant: "blog"
    }
  });

  type CategoryProps = {
    compName?: string;
    className?: string;
    title: string;
    icon?: HeroiconsIcons;
  } & VariantProps<typeof tvCategory>;

  let { compName = "Category", className, title, variant, icon = "folder-open-outline" }: CategoryProps = $props();

  switch (title) {
  case "Client":
    icon = "home-modern-outline";
    break;
  case "Agency":
    icon = "building-office-outline";
    break;
  case "Side Project":
    icon = "users-outline";
    break;
  default:
    icon = "folder-open-outline";
    break;
  }

  console.log(icon);
</script>

{#if title}
  <div data-comp={compName} class={tvCategory({ variant, className })}>
    <IconSprite className="-translate-y-px" {icon} size={"relative"} />
    {title}
  </div>
{/if}
