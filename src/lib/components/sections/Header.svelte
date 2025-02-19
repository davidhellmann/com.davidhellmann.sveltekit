<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import NavigationMain from "$components/navigation/Main.svelte";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import meHi from "$lib/images/me-hi.avif";

  const tvHeader = tv({
    slots: {
      slotBase:
        "fixed inset-x-0 z-20 fluid-grid lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto bottom-4 md:bottom-auto md:top-12 lg:top-16 font-decorative h-12 xs:h-16",
      slotWrapper: "span-content relative flex justify-center items-center",
      slotLogo:
        "transition duration-200 block fixed md:absolute left-fluid top-fluid md:left-0 md:top-0 md:bottom-0 rounded-full shadow-sm isolote backdrop-blur-sm bg-white/10 size-16 hover:scale-125 hover:rotate-3",
      slotLogoLink: "is-zoomInDown flex justify-center items-center size-16"
    }
  });

  type HeaderProps = {
    compName?: string;
    className?: string;
    scrollY: number;
  } & VariantProps<typeof tvHeader>;

  let { compName = "Header", className, scrollY }: HeaderProps = $props();

  const { slotBase, slotWrapper, slotLogo, slotLogoLink } = tvHeader({ className });
</script>

<header class={`${slotBase({ className })}`} data-comp={compName}>
  <div class={slotWrapper()} use:useWaypoint data-waypoint>
    <h1 class={`${slotLogo()} ${scrollY > 100 ? "translate-y-2 md:-translate-y-10 scale-90" : ""}`}>
      <a data-waypoint-target class={slotLogoLink()} href="/">
        <img src={meHi} alt="" />
      </a>
    </h1>
    <NavigationMain
      className={`${
        scrollY > 100 ? "transition duration-200 translate-y-2 md:-translate-y-10 scale-90" : "transition duration-200 "
      }`}
    />
  </div>
</header>

<!-- <style>
  [data-comp="Header"] {
    view-transition-name: header;
  }
</style> -->
