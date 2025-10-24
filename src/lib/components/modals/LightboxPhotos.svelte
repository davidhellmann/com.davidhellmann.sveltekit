<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import Exif from "$components/text/Exif.svelte";
  import type { ComponentProps } from "svelte";
  import { tv, type VariantProps } from "tailwind-variants";
  import { useLightbox } from "$lib/actions/action.lightbox";
  import "$styles/lightbox.css";

  const tvLightboxPhotos = tv({
    slots: {
      slotRoot: "columns-2 md:columns-3 xl:columns-4 gap-fluid space-y-fluid pointer-events-none",
      slotItem: "@container flex-col flex flex-nowrap items-center group break-inside-avoid"
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
        <div class="rounded-xl overflow-hidden w-full">
          <Image
            ratio="aspect-auto"
            className="w-full pointer-events-auto cursor-pointer group-hover:scale-105 transition-transform"
            noscript={false}
            {image}
            index={i}
          />
        </div>
        {#if image?.exif}
          <Exif className="w-full text-neutral-600 p-2" spacing="compact" exif={image?.exif} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
