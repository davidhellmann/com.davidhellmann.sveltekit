<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import NavigationMain from "$components/navigation/Main.svelte";
  import { useWaypoint } from "$lib/actions/action.waypoint";


  const tvHeader = tv({
    slots: {
      slotBase: "fixed inset-x-0 z-20 fluid-grid lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto bottom-4 md:bottom-auto md:top-12 lg:top-16 font-walsheim",
      slotWrapper: "span-content relative flex justify-center items-center",
      slotLogo: "transition duration-200 hidden md:block absolute left-0 top-0 bottom-0 rounded-full shadow isolote backdrop-blur bg-accent-purple-500/50 ring-1 ring-white/50 text-sm lg:text-base",
      slotLogoLink: "is-zoomInDown flex justify-center items-center w-14 h-14 md:w-auto md:h-full aspect-square text-accent-purple-100"
    }
  });

  type HeaderProps = {
    compName?: string;
    className?: string;
    scrollY: number;
  } & VariantProps<typeof tvHeader>;

  let {
    compName = "Header",
    className,
    scrollY,
  }: HeaderProps = $props();

  const { slotBase, slotWrapper, slotLogo, slotLogoLink } = tvHeader({ className });

</script>

<header class={`${slotBase({ className })}`} data-comp={compName} >
  <div class={slotWrapper()} use:useWaypoint={{ rootMargin: "0px 0px 0px 0px"}} data-waypoint>
    <h1 class={`${slotLogo()} ${scrollY > 100 ? "translate-y-2 md:-translate-y-10 scale-90" : ""}`}>
      <a data-waypoint-target class={slotLogoLink()} href="/">DH</a>
    </h1>
    <NavigationMain
      className={`${scrollY > 100 ?
        "transition duration-200 translate-y-2 md:-translate-y-10 scale-90" :
        "transition duration-200 "}`} />
  </div>
</header>
