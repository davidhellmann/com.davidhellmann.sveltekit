<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { ComponentProps } from "svelte";
  import Image from "$components/image/Image.svelte";
  import Headline from "$components/text/Headline.svelte";
  import DecorativeWrapper from "$components/wrapper/DecorativeWrapper.svelte";
  import { getRandomNumberFromRange } from "$lib/utils/getRandomNumberFromRange";


  const tvCardPhotos = tv({
    slots: {
      slotBase: "",
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

  const { slotBase } = tvCardPhotos({ className });
</script>

{#if headline && url}
  <a href={url} class={slotBase({ className })} style={`transform: rotate(${getRandomNumberFromRange(-2, 2)}deg)`} data-comp={compName}>
    {#if image}
      <DecorativeWrapper preset="polaroid">
        <Image image={image} noscript={false} className=" rounded-sm border-2 border-neutral-900/20" ratio="aspect-square" />
        <Headline text={headline} size="xs" family="mono" weight="normal" className="pt-2 px-2 text-neutral-800/50" />
      </DecorativeWrapper>
    {/if}
  </a>
{/if}


