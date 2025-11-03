<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import type { ComponentProps } from "svelte";
  import { tv, type VariantProps } from "$lib/utils/classNames";
  import Grid from "$components/containers/Grid.svelte";
  import { useLightbox } from "$lib/actions/action.lightbox";
  import "$styles/lightbox.css";

  const tvLightboxWork = tv({
    slots: {
      slotWrapper: "relative cursor-pointer rounded-t-3xl",
      slotCard:
        "[column-break-inside:avoid] group overflow-clip rounded-xl flex flex-col bg-black ring-1 ring-neutral-800 shadow-xl shadow-black transition-all hover:shadow-2xl hover:shadow-black hover:-translate-y-0.5",
      slotBrowser: "bg-neutral-900 rounded-t-lg h-8 flex flex-row items-center gap-1 pl-4",
      slotBrowserDot: "block rounded-full size-2 transition"
    }
  });

  type LightboxWorkProps = {
    compName?: string;
    className?: string;
    images: ComponentProps<typeof Image>["image"][];
    ratio?: string;
  } & VariantProps<typeof tvLightboxWork>;

  let { compName = "LightboxWork", className, images, ratio = "aspect-auto" }: LightboxWorkProps = $props();

  const items = images.map((image) => ({
    src: image?.url,
    thumb: image?.url,
    width: image?.width?.toString()
  }));

  const { slotWrapper, slotCard, slotBrowser, slotBrowserDot } = tvLightboxWork({ className });

  const getAspectRatio = (image: ComponentProps<typeof Image>["image"]) => {
    const ratio = (image?.width ?? 1) / (image?.height ?? 1);
    if (ratio >= 1) return "aspect-auto";
    if (ratio < 1) return "aspect-square md:aspect-portrait";
  };
</script>

{#if images}
  <div data-comp={compName} class={slotWrapper({ className })} use:useLightbox={{ items: items, className: "is-dark" }}>
    <Grid columns={"work-gallery"} gap={"fluid"}>
      {#each images as image, i (image?.id)}
        <div class={slotCard()}>
          <span class={slotBrowser()}>
            <span class={`${slotBrowserDot()} bg-neutral-700 group-hover:bg-[red]`}></span>
            <span class={`${slotBrowserDot()} bg-neutral-700 group-hover:bg-[orange]`}></span>
            <span class={`${slotBrowserDot()} bg-neutral-700 group-hover:bg-[green]`}></span>
          </span>
          <Image
            className={`size-full ${getAspectRatio(image) ?? ratio}`}
            index={i}
            {image}
            focalPoint={[0.5, 0]}
            noscript={false}
          />
        </div>
      {/each}
    </Grid>
  </div>
{/if}
