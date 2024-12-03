<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Time from "svelte-time";
  import IconSprite from "$components/ui/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  const tvCategory = tv({
    base: "flex items-center gap-2 font-mono text-sm"
  });

  type CategoryProps = {
    compName?: string;
    className?: string;
    timestamp: string;
    format?: string;
    icon?: HeroiconsIcons | false;
  } & VariantProps<typeof tvCategory>;

  const {
    compName = "Category",
    className,
    timestamp,
    format = "DD. MMM YYYY",
    icon = "calendar-outline"
  }: CategoryProps = $props();
</script>

{#if timestamp}
  <div data-comp={compName} class={tvCategory({ className })}>
    {#if icon}
      <IconSprite className="-translate-y-px" {icon} size={"relative"} />
    {/if}
    <Time {format} {timestamp} />
  </div>
{/if}
