<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/ui/IconSprite.svelte";

  const tvCategory = tv({
    base: "flex items-center gap-2 font-mono text-sm",
    variants: {
      variant: {
        blog: "",
        work: "bg-neutral-900/10 border border-neutral-100/20 text-current px-3 pt-1.5 pb-1 rounded-md self-start"
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
  } & VariantProps<typeof tvCategory>;

  const { compName = "Category", className, title, variant }: CategoryProps = $props();
</script>

{#if title}
  <div data-comp={compName} class={tvCategory({ variant, className })}>
    <IconSprite className="-translate-y-px" icon="folder-open-outline" size={"relative"} />
    {title}
  </div>
{/if}
