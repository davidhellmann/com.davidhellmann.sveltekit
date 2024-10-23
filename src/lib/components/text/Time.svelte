<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Time from "svelte-time";
  import IconSprite from "$components/ui/IconSprite.svelte";

  const tvCategory = tv({
    base: "flex items-center gap-2 font-mono text-sm",
  });

  type CategoryProps = {
    compName?: string;
    className?: string;
    timestamp: string;
  } & VariantProps<typeof tvCategory>;

  const {
    compName = "Category",
    className,
    timestamp
  }: CategoryProps = $props();
</script>

{#if timestamp}
  <div
    data-comp={compName}
    class={tvCategory({ className })}
  >
    <IconSprite
      className="-translate-y-px"
      icon="calendar-outline"
      size={"relative"}
    />
    <Time format="DD. MMM YYYY" timestamp={timestamp} />
  </div>
{/if}
