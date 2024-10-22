<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Pill from "$components/text/Pill.svelte";

  const tvAsideBlogDetail = tv({
    slots: {
      slotWrapper: "sticky top-12",
    },
  });

  type AsideBlogDetailProps = {
    compName?: string;
    className?: string;
    category?: {
      title?: string;
      url?: string;
    };
  } & VariantProps<typeof tvAsideBlogDetail>;

  const {
    compName = "AsideBlogDetail",
    className,
    category
  }: AsideBlogDetailProps = $props();

  const {slotWrapper} = tvAsideBlogDetail();
</script>

{#if category}
  <div
    data-comp={compName}
    class={slotWrapper({ className })}
  >
    {#if category?.title}
      <Pill text={category?.title} url={category?.url} />
    {/if}
  </div>
{/if}
