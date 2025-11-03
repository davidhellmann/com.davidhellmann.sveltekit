<script lang="ts">
  import { tv, type VariantProps } from "$utils/classNames";
  import Pill from "$components/text/Pill.svelte";

  const tvAsideBlogSingle = tv({
    slots: {
      slotWrapper: "sticky top-12"
    }
  });

  type AsideBlogSingleProps = {
    compName?: string;
    className?: string;
    category?: {
      title?: string;
      url?: string;
    };
  } & VariantProps<typeof tvAsideBlogSingle>;

  const { compName = "AsideBlogSingle", className, category }: AsideBlogSingleProps = $props();

  const { slotWrapper } = tvAsideBlogSingle();
</script>

{#if category}
  <div data-comp={compName} class={slotWrapper({ className })}>
    {#if category?.title}
      <Pill text={category?.title} url={category?.url} />
    {/if}
  </div>
{/if}
