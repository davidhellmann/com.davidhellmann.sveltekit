<script lang="ts">
  import Image from "$components/image/Image.svelte";
  import type { ComponentProps } from "svelte";
  import { tv, type VariantProps } from "tailwind-variants";
  import Grid from "$components/layout/Grid.svelte";
  import { useLightbox } from "$lib/actions/action.lightbox";
  import "$styles/lightbox.css";

  const tvLightboxWork = tv({
    slots: {
      slotWrapper: "relative cursor-pointer bg-neutral-950 rounded-3xl p-fluid",
      slotButton: "font-mono absolute bg-olkch-pink text-white px-4 py-2 text-xs bottom-6 lg:bottom-12 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 lg:left-12 rounded-lg",
    },
  });

  type LightboxWorkProps = {
    compName?: string;
    className?: string;
    images: ComponentProps<typeof Image>["image"][];
    ratio?: ComponentProps<typeof Image>["ratio"];
  } & VariantProps<typeof tvLightboxWork>;

  let {
    compName = "LightboxWork",
    className,
    images,
    ratio = "aspect-landscape"
  }: LightboxWorkProps = $props();

  const items = images.map((image) => ({
    src: image?.url,
    thumb: image?.url,
    width: image?.width?.toString(),
  }));

  const { slotWrapper, slotButton } = tvLightboxWork({ className });
</script>
{#if images}
  <div data-comp={compName} class={slotWrapper({className})}
       use:useLightbox={{ items: items}}>
    <Grid columns={"image-gallery"} gap={"fluid"}>
      {#each images.slice(0, 3) as image (image?.id)}
        <Image image={image} className="rounded-xl" ratio={ratio} noscript={false} />
      {/each}
      <span class={slotButton({})}>Open Gallery ({images.length})</span>
    </Grid>
  </div>
{/if}
