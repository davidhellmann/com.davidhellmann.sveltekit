<script lang="ts">
  import Image from "$components/image/Image.svelte";
  import type { ComponentProps } from "svelte";

  type BlockImage = {
    compName?: string;
    image: ComponentProps<typeof Image>["image"];
    imageRatio?: ComponentProps<typeof Image>["ratio"];
    showCaption?: boolean;
  }

  const {
    compName = "BlockImage",
    image,
    imageRatio,
    showCaption,
  }: BlockImage = $props();
</script>

{#if image}
  <div class="span-content" data-comp={compName}>
    <Image image={image} ratio={imageRatio} />
  </div>
{/if}
