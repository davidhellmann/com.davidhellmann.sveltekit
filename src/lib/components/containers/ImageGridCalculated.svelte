<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import type { ComponentProps } from "svelte";
  import { tv, type VariantProps } from "$lib/utils/classNames";

  const tvLightbox = tv({
    slots: {
      slotWrapper: "flex flex-col lg:flex-row flex-nowrap gap-4 md:gap-8"
    }
  });

  type LightboxProps = {
    compName?: string;
    className?: string;
    images: ComponentProps<typeof Image>["image"][];
  } & VariantProps<typeof tvLightbox>;

  let { compName = "Lightbox", className, images }: LightboxProps = $props();

  const { slotWrapper } = tvLightbox({ className });
</script>

{#if images}
  <div data-comp={compName} class={slotWrapper({ className })}>
    {#each images.slice(0, images.length) as image (image?.id)}
      {#if image && image?.width && image?.height}
        <div
          style={`--ratio: ${image?.width} / ${image?.height}; flex-basis: 0; aspect-ratio: var(--ratio); flex-grow: calc(var(--ratio) * 2);`}
        >
          <Image {image} className={"aspect-auto size-full"} noscript={false} />
        </div>
      {/if}
    {/each}
  </div>
{/if}
