<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import Exif from "$components/text/Exif.svelte";
  import type { ComponentProps } from "svelte";
  import { tv, type VariantProps } from "tailwind-variants";
  import { useLightbox } from "$lib/actions/action.lightbox";
  import "$styles/lightbox.css";

  const tvLightboxPhotos = tv({
    slots: {
      slotRoot: "sm:columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4 pointer-events-none",
      slotItem:
        "@container cursor-zoom-in flex-col flex flex-nowrap items-center group break-inside-avoid border border-neutral-200 bg-neutral-50 rounded-2xl p-3"
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
            className="w-full aspect-auto pointer-events-auto cursor-zoom-in group-hover:scale-105 transition-transform"
            noscript={false}
            {image}
            index={i}
          />
        </div>
        {#if image?.exif}
          <Exif className="w-full text-neutral-600 p-2 pt-3" spacing="compact" exif={image?.exif} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
