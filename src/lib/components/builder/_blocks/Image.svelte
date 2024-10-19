<script lang="ts">
  import Image from "$components/image/Image.svelte";
  import type { ComponentProps } from "svelte";

  type BlockImage = {
    compName?: string;
    image: ComponentProps<typeof Image>["image"];
    ratio?: ComponentProps<typeof Image>["ratio"];
    showCaption?: boolean;
  }

  const {
    compName = "BlockImage",
    image,
    ratio,
    showCaption,
  }: BlockImage = $props();
</script>

{#if image}
  <div class="span-content" data-comp={compName}>
    <Image image={image} ratio={ratio} />
  </div>
{/if}
