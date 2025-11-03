<script lang="ts">
  import { tv, type VariantProps } from "$utils/classNames";
  import Time from "svelte-time";
  import IconSprite from "$components/media/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";

  const tvTime = tv({
    base: "flex items-center gap-2 font-mono text-sm"
  });

  type TimeProps = {
    compName?: string;
    className?: string;
    timestamp?: string;
    text?: string;
    format?: string;
    icon?: HeroiconsIcons | false;
  } & VariantProps<typeof tvTime>;

  const {
    compName = "Time",
    className,
    timestamp,
    text,
    format = "DD. MMM YYYY",
    icon = "calendar-outline"
  }: TimeProps = $props();
</script>

{#if timestamp || text}
  <div data-comp={compName} class={tvTime({ className })}>
    {#if icon}
      <IconSprite className="-translate-y-px" {icon} size={"relative"} />
    {/if}
    {#if text && !timestamp}{text}{/if}
    {#if timestamp && !text}
      <Time {format} {timestamp} />
    {/if}
  </div>
{/if}
