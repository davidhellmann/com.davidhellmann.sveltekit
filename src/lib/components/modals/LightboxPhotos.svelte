<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import Exif from "$components/text/Exif.svelte";
  import type { ComponentProps } from "svelte";
  import { tv, type VariantProps } from "tailwind-variants";
  import { useLightbox } from "$lib/actions/action.lightbox";
  import "$styles/lightbox.css";

  const tvLightboxPhotos = tv({
    slots: {
      slotRoot: "grid md:grid-cols-3 xl:grid-cols-4 gap-fluid items-center pointer-events-none",
      slotItem: "@container flex-col flex items-center group"
    }
  });

  type LightboxPhotosProps = {
    compName?: string;
    className?: string;
    images: ComponentProps<typeof Image>["image"][];
    ratio?: ComponentProps<typeof Image>["ratio"];
    galleryId?: string;
  } & VariantProps<typeof tvLightboxPhotos>;

  let {
    compName = "LightboxPhotos",
    className,
    images,
    ratio = "aspect-auto",
    galleryId
  }: LightboxPhotosProps = $props();

  const items = $derived(
    images.map((image) => ({
      src: image?.url,
      thumb: image?.url,
      width: image?.width?.toString()
    }))
  );

  const { slotRoot, slotItem } = tvLightboxPhotos({ className });
</script>

{#if images}
  <ul
    data-comp={compName}
    class={slotRoot({ className })}
    use:useLightbox={{ items, showThumbs: false, className: "is-photos" }}
  >
    {#each images as image, i (image?.id)}
      <li class={slotItem()}>
        <Image
          ratio="aspect-portrait"
          className="w-full pointer-events-auto cursor-pointer rounded-xl"
          noscript={false}
          {image}
          index={i}
        />
        {#if image?.exif}
          <Exif className="w-full text-neutral-600 p-2" spacing="compact" exif={image?.exif} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
