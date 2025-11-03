<script lang="ts">
  import { tv, type VariantProps } from "$lib/utils/classNames";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useFullWidthText } from "$lib/actions/action.fullWidthText";

  const tvFooter = tv({
    slots: {
      slotBase:
        "fluid-grid w-full lg:max-w-[min(calc(100%-4vw),2000px)] left-1/2 -translate-x-1/2 mt-40 z-20 relative bg-[rgba(255,255,255,0.025)]  border-t border-neutral-500/20",
      slotInner: "span-full is-zoomInUp overflow-clip",
      slotBigText: "translate-y-1/4 scale-105 uppercase font-decorative font-extrabold text-neutral-500/5 text-center"
    }
  });

  type FooterProps = {
    compName?: string;
    className?: string;
    isPhotos?: boolean;
  } & VariantProps<typeof tvFooter>;

  let { compName = "Footer", className, isPhotos = false }: FooterProps = $props();

  const { slotBase, slotInner, slotBigText } = tvFooter({ className });
</script>

<footer
  class={`${slotBase({ className })} ${isPhotos ? "border-t-0" : ""}`}
  data-comp={compName}
  use:useWaypoint
  data-waypoint
>
  <div class={slotInner()} data-waypoint-target>
    <div class={slotBigText()} use:useFullWidthText><span class="leading-[1]!">LÄUFT</span></div>
  </div>
</footer>
