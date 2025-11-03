<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import type { ComponentProps } from "svelte";
  import { tv, type VariantProps } from "$utils/classNames";
  import Grid from "$components/containers/Grid.svelte";
  import { useLightbox } from "$lib/actions/action.lightbox";
  import "$styles/lightbox.css";

  const tvLightbox = tv({
    slots: {
      slotWrapper: "relative cursor-pointer",
      slotButton:
        "font-mono absolute bg-neon-pink text-white px-4 py-2 text-xs bottom-6 lg:bottom-12 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 lg:left-12 rounded-lg"
    }
  });

  type LightboxProps = {
    compName?: string;
    className?: string;
    images: ComponentProps<typeof Image>["image"][];
    ratio?: string;
  } & VariantProps<typeof tvLightbox>;

  let { compName = "Lightbox", className, images, ratio = "aspect-landscape" }: LightboxProps = $props();

  const items = images.map((image) => ({
    src: image?.url,
    thumb: image?.url,
    width: image?.width?.toString(),
    srcset: image?.srcset
  }));

  const { slotWrapper, slotButton } = tvLightbox({ className });
</script>

{#if images}
  <div data-comp={compName} class={slotWrapper({ className })} use:useLightbox={{ items: items }}>
    <Grid columns={"image-gallery"} gap={0}>
      {#each images.slice(0, 3) as image, i (image?.id)}
        <Image index={i} {image} className={ratio} noscript={false} />
      {/each}
      <span class={slotButton({})}>Open Gallery ({images.length})</span>
    </Grid>
  </div>
{/if}
