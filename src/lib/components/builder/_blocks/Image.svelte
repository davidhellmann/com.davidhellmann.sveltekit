<script lang="ts">
  import Image from "$components/image/Image.svelte";
  import type { Asset, ImageRatio } from "$lib/types/components";

  type BlockImage = {
    compName?: string;
    image: Asset;
    imageRatio?: ImageRatio;
  }

  const {
    compName = "BlockImage",
    image,
    imageRatio,
  }: BlockImage = $props();
</script>

{#if image}
  <div class="span-content" data-comp={compName}>
    <Image image={image} ratio={imageRatio} />
  </div>
{/if}
