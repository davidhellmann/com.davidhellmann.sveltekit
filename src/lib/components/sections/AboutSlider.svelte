<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Image from "$components/media/Image.svelte";
  import EmblaSlider from "$components/containers/EmblaSlider.svelte";
  import EmblaSlide from "$components/containers/EmblaSlide.svelte";
  import Polaroid from "$components/decorative/Polaroid.svelte";
  import Headline from "$components/text/Headline.svelte";
  import type { ComponentProps } from "svelte";

  const tvAboutSlider = tv({
    base: "grid grid-cols-subgrid span-full"
  });

  type AboutSliderProps = {
    compName?: string;
    className?: string;
    headline: string;
    images: ComponentProps<typeof Image>["image"][];
  } & VariantProps<typeof tvAboutSlider>;

  let { compName = "AboutSlider", className, images, headline }: AboutSliderProps = $props();
</script>

{#if images && headline}
  <section class={tvAboutSlider({ className })} data-comp={compName}>
    <Headline className={"span-xl z-10 pb-12"} text={headline} />
    <EmblaSlider
      pluginAutoscroll={true}
      loop={true}
      dragFree={true}
      align="start"
      className="span-full z-10 items-center pb-fluid opacity-90"
    >
      {#each images as image, i}
        {@const width = image?.width || 0}
        {@const height = image?.height || 0}
        <EmblaSlide index={i} width={width > height ? "half" : "quarter"}>
          <Polaroid className="p-2 rounded-md *:rounded-xs">
            {#if image?.width && image?.height}
              <Image
                ratio={image?.width > image?.height ? "aspect-landscape" : "aspect-portrait"}
                noscript={false}
                {image}
              />
            {/if}
          </Polaroid>
        </EmblaSlide>
      {/each}
    </EmblaSlider>
  </section>
{/if}
