<script lang="ts">
  import Image from "$components/image/Image.svelte";
  import type { ComponentProps } from "svelte";

  type BlockImage = {
    compName?: string;
    image: ComponentProps<typeof Image>["image"];
    ratio?: ComponentProps<typeof Image>["ratio"];
    width?: string
    showCaption?: boolean;
  }

  const {
    compName = "BlockImage",
    image,
    ratio,
    width,
    showCaption,
  }: BlockImage = $props();

  const containerWidht = {
    "full": "span-full",
    "wide": "col-start-[col-1] col-end-[content-end]",
    "content": "col-start-[col-1] col-end-[col-9]",
  }[width ?? "full"];
</script>

{#if image}
  <div class={containerWidht} data-comp={compName}>
    <Image image={image} ratio={ratio} />
  </div>
{/if}
