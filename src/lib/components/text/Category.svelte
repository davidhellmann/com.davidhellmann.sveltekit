<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$lib/components/ui/IconSprite.svelte";

  const tvCategory = tv({
    base: "flex items-center gap-2 font-mono text-sm",
  });

  type CategoryProps = {
    compName?: string;
    className?: string;
    title: string;
  } & VariantProps<typeof tvCategory>;

  const {
    compName = "Category",
    className,
    title
  }: CategoryProps = $props();
</script>

{#if title}
  <div
    data-comp={compName}
    class={tvCategory({ className })}
  >
    <IconSprite
      className="-translate-y-px"
      icon="folder-open-outline"
      size={"relative"}
    />
    {title}
  </div>
{/if}
