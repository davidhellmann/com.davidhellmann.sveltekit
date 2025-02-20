<script lang="ts">
  import type { EmblaOptionsType } from "embla-carousel";
  import emblaCarouselSvelte from "embla-carousel-svelte";
  import Autoscroll from "embla-carousel-auto-scroll";
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvEmblaSlider = tv({
    slots: {
      slotBase: "embla overflow-hidden",
      slotContainer: "embla__container flex",
      slotSlide: "embla__slide"
    },
    variants: {
      vAlign: {
        center: {
          slotContainer: "items-center"
        },
        start: {
          slotContainer: "items-start"
        },
        end: {
          slotContainer: "items-end"
        }
      }
    },
    defaultVariants: {
      vAlign: "center"
    }
  });

  type EmblaSliderProps = {
    compName?: string;
    className?: string;
    children: Snippet;
    pluginAutoscroll?: boolean;
  } & VariantProps<typeof tvEmblaSlider> &
    EmblaOptionsType;

  let {
    compName = "EmblaSlider",
    vAlign,
    className,
    children,
    pluginAutoscroll = false,
    ...rest
  }: EmblaSliderProps = $props();
  let options = { ...rest };
  let plugins = [];

  if (pluginAutoscroll) {
    plugins.push(Autoscroll({ speed: 1, startDelay: 0, stopOnMouseEnter: false, stopOnInteraction: false }));
  }

  const { slotBase, slotContainer } = tvEmblaSlider({ vAlign, className });
</script>

{#if children}
  <div class={slotBase({ className })} data-comp={compName} use:emblaCarouselSvelte={{ options, plugins }}>
    <div class={slotContainer({ vAlign })}>
      {@render children()}
    </div>
  </div>
{/if}
