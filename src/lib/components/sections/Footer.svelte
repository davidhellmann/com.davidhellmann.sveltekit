<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import { useWaypoint } from "$lib/actions/action.waypoint";


  const tvFooter = tv({
    slots: {
      slotBase: "fluid-grid w-full lg:max-w-[min(calc(100%-4vw),2000px)] left-1/2 -translate-x-1/2 mt-40 z-20 relative bg-[rgba(255,255,255,0.025)]  border-t border-neutral-500/20",
      slotInner: "span-content py-16 is-zoomInUp"
    }
  });

  type FooterProps = {
    compName?: string;
    className?: string;
  } & VariantProps<typeof tvFooter>;

  let {
    compName = "Footer",
    className,
  }: FooterProps = $props();

  const { slotBase, slotInner } = tvFooter({ className });

</script>

<footer class={`${slotBase({ className })}`}
        data-comp={compName}
        use:useWaypoint data-waypoint>
  <div class={slotInner()} data-waypoint-target>Footer WIP</div>
</footer>
