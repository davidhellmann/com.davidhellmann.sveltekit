<script lang="ts">
  import type { EmblaOptionsType } from "embla-carousel";
  import emblaCarouselSvelte from "embla-carousel-svelte";
  import Autoscroll from "embla-carousel-auto-scroll";
  import { WheelGesturesPlugin, type WheelGesturesPluginOptions } from "embla-carousel-wheel-gestures";
  import type { AutoScrollOptionsType } from "embla-carousel-auto-scroll";
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";

  const tvEmblaSlider = tv({
    slots: {
      slotBase: "embla",
      slotContainer: "embla__container flex"
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
    pluginWheelGestures?: boolean;
    emblaOptions?: EmblaOptionsType;
    autoScrollOptions?: AutoScrollOptionsType;
    wheelGesturesOptions?: WheelGesturesPluginOptions;
  } & VariantProps<typeof tvEmblaSlider>;

  let {
    compName = "EmblaSlider",
    vAlign,
    className,
    children,
    pluginAutoscroll = false,
    pluginWheelGestures = true,
    emblaOptions,
    autoScrollOptions,
    wheelGesturesOptions
  }: EmblaSliderProps = $props();
  let options: EmblaOptionsType = { loop: true, dragFree: true, align: "start", ...emblaOptions };
  let plugins = [];

  if (pluginAutoscroll) {
    plugins.push(
      Autoscroll({
        speed: 2,
        direction: "forward",
        startDelay: 0,
        stopOnMouseEnter: false,
        stopOnInteraction: false,
        ...autoScrollOptions
      })
    );
  }

  if (pluginWheelGestures) {
    plugins.push(
      WheelGesturesPlugin({
        ...wheelGesturesOptions
      })
    );
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
