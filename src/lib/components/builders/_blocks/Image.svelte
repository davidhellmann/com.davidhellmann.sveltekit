<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import type { ComponentProps } from "svelte";

  type BlockImage = {
    compName?: string;
    image?: ComponentProps<typeof Image>["image"];
    className?: string;
    width?: string;
    showCaption?: boolean;
  };

  const { compName = "BlockImage", image, width, className, showCaption }: BlockImage = $props();

  const containerWidht = {
    full: "span-full",
    wide: "span-content",
    content: "span-xl"
  }[width ?? "full"];
</script>

{#if image}
  <div class={containerWidht} data-comp={compName}>
    <Image {image} {className} />
    {#if showCaption}{/if}
  </div>
{/if}
