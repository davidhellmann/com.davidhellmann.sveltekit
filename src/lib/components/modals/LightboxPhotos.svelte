<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import Exif from "$components/text/Exif.svelte";
  import type { ComponentProps } from "svelte";
  import { cn, tv, type VariantProps } from "$utils/classNames";
  import { useLightbox } from "$lib/actions/action.lightbox";
  import "$styles/lightbox.css";

  const tvLightboxPhotos = tv({
    slots: {
      slotRoot: "sm:columns-2 lg:columns-3 gap-8 space-y-8 pointer-events-none",
      slotItem:
      "@container relative cursor-zoom-in flex-col flex flex-nowrap items-center group break-inside-avoid",
      slotExif: "absolute bottom-4 left-4 right-4 bg-white p-2 transition translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
    }
  });

  type LightboxPhotosProps = {
    compName?: string;
    className?: string;
    images: ComponentProps<typeof Image>["image"][];
    ratio?: string;
    galleryId?: string;
  } & VariantProps<typeof tvLightboxPhotos>;

  let { compName = "LightboxPhotos", className, images, ratio }: LightboxPhotosProps = $props();

  const items = $derived(
    images.map((image) => ({
      src: image?.url,
      thumb: image?.url,
      width: image?.width?.toString()
    }))
  );

  const { slotRoot, slotItem, slotExif } = tvLightboxPhotos({ className });
</script>

{#if images}
  <ul
    data-comp={compName}
    class={slotRoot({ className })}
    use:useLightbox={{ items, showThumbs: false, className: "is-photos" }}
  >
    {#each images as image, i (image?.id)}
      <li class={slotItem()}>
        <div class="overflow-hidden w-full">
          <Image
            className={cn(
              "w-full pointer-events-auto cursor-zoom-in group-hover:scale-105 transition-transform",
              ratio
            )}
            noscript={false}
            {image}
            index={i}
            lazy={i > 0}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        {#if image?.__typename === "images_Asset" && image?.exif}
          <Exif className={slotExif()} showCamera={false} spacing="compact" exif={image?.exif} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
