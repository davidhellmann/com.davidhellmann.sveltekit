<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import Exif from "$components/text/Exif.svelte";
  import type { ComponentProps } from "svelte";
  import { cn, tv, type VariantProps } from "$utils/classNames";
  import { useLightbox } from "$lib/actions/action.lightbox";
  import "$styles/lightbox.css";

  const tvLightboxPhotos = tv({
    slots: {
      slotRoot: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pointer-events-none",
      slotItem:
        "@container cursor-zoom-in group"
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
        <div class="overflow-hidden w-full">
          <Image
            className={cn(
              "w-full pointer-events-auto cursor-zoom-in aspect-instagram group-hover:scale-105 transition-transform",
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
          <Exif className="w-full mt-2" showCamera={false} spacing="compact" exif={image?.exif} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
