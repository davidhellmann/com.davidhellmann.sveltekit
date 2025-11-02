<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { ComponentProps } from "svelte";
  import Image from "$components/media/Image.svelte";
  import Headline from "$components/text/Headline.svelte";
  import Exif from "$components/text/Exif.svelte";
  import Polaroid from "$components/decorative/Polaroid.svelte";
  import { getRandomNumberFromRange } from "$lib/utils/getRandomNumberFromRange";

  const tvCardPhotos = tv({
    slots: {
      slotBase: "font-mono block group relative @container",
      slotImage: "w-full overflow-hidden",
      slotContent: "px-3 pt-2 pb-4",
      slotHeadline: "text-neutral-500 mt-1 line-clamp-1 text-sm font-mono font-semibold",
      slotExif: "text-neutral-700"
    }
  });

  type CardPhotosProps = {
    compName?: string;
    className?: string;
    headline: string;
    url: string;
    image: ComponentProps<typeof Image>["image"];
  } & VariantProps<typeof tvCardPhotos>;

  let { compName = "CardPhotos", className, headline, url, image }: CardPhotosProps = $props();
  const _headline = headline.split(" (")?.[0] ?? headline;

  const { slotBase, slotImage, slotContent, slotHeadline, slotExif } = tvCardPhotos({ className });
</script>

{#if _headline && url}
  <a
    href={url}
    class={slotBase({ className })}
    style={`rotate: ${getRandomNumberFromRange(-4, 4)}deg;`}
    data-comp={compName}
    data-waypoint-target
  >
    {#if image}
      <Polaroid>
        <div class={slotImage({})}>
          <Image {image} noscript={false} className="transition-all group-hover:scale-105 aspect-auto" />
        </div>
        <div class={slotContent()}>
          {#if image?.__typename === "images_Asset" && image?.exif}
            <Exif exif={image?.exif} showSettings={false} spacing="compact" className={slotExif()} />
          {/if}
          <Headline text={_headline} className={slotHeadline({})} />
        </div>
      </Polaroid>
    {/if}
  </a>
{/if}
