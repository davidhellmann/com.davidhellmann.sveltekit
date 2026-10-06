<script lang="ts">
  import { tv, type VariantProps } from "#lib/utils/classNames.js";
  import Time from "svelte-time";
  import IconSprite from "#lib/components/media/IconSprite.svelte";
  import type { HeroiconsIcons } from "#lib/types/heroicons-icons.js";
  import { toDateTimeString } from "#lib/utils/date.js";

  const tvTime = tv({
    base: "flex items-center gap-2 font-mono text-sm"
  });

  type TimeProps = {
    compName?: string;
    className?: string;
    timestamp?: unknown;
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

  const formattedTimestamp = $derived(toDateTimeString(timestamp));
</script>

{#if formattedTimestamp || text}
  <div data-comp={compName} class={tvTime({ className })}>
    {#if icon}
      <IconSprite className="-translate-y-px" {icon} size="relative" />
    {/if}
    {#if text && !formattedTimestamp}{text}{/if}
    {#if formattedTimestamp && !text}
      <Time {format} timestamp={formattedTimestamp} />
    {/if}
  </div>
{/if}
