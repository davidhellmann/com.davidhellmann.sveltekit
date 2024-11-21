<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { ComponentProps } from "svelte";
  import Image from "$components/image/Image.svelte";
  import Headline from "$components/text/Headline.svelte";
  import DecorativeWrapper from "$components/wrapper/DecorativeWrapper.svelte";
  import { getRandomNumberFromRange } from "$lib/utils/getRandomNumberFromRange";
  import { getRandomString } from "$lib/utils/getRandomString";
  import { getRandomItemFromArray } from "$lib/utils/getRandomItemFromArray";

  const cameras = ["Fuji X100VI", "Fuji X-Pro3", "Ricoh GRIIIx"];


  const tvCardPhotos = tv({
    slots: {
      slotBase: "font-mono block group relative",
      slotImage: "border-2 border-neutral-300 border-t-neutral-400 border-l-neutral-400 overflow-hidden",
      slotHeadline: "mt-4 px-1 text-neutral-800/50 line-clamp-1",
      slotNumber: "text-2xs uppercase tracking-widest absolute bottom-10 translate-y-0.5 inset-x-0 text-neutral-400/50 flex px-3 justify-between",
    },
  });

  type CardPhotosProps = {
    compName?: string;
    className?: string;
    headline: string;
    url: string;
    image: ComponentProps<typeof Image>["image"];
  } & VariantProps<typeof tvCardPhotos>;

  let {
    compName = "CardPhotos",
    className,
    headline,
    url,
    image
  }: CardPhotosProps = $props();

  const { slotBase, slotImage, slotHeadline, slotNumber } = tvCardPhotos({ className });
</script>

{#if headline && url}
  <a href={url} class={slotBase({ className })} style={`rotate: ${getRandomNumberFromRange(-4, 4)}deg;`} data-comp={compName} data-waypoint-target>
    {#if image}
      <DecorativeWrapper preset="polaroid">
        <div class={slotImage({})}>
          <Image image={image} noscript={false} className="transition-all group-hover:scale-105" ratio="aspect-auto" />
        </div>
        <Headline text={headline} size="sm" family="mono" weight="semibold" className={slotHeadline({})} />
        <div class={slotNumber()}>
          <span>{getRandomItemFromArray(cameras)}</span>
          <span>{getRandomString(10)}</span>
        </div>
      </DecorativeWrapper>
    {/if}
  </a>
{/if}


