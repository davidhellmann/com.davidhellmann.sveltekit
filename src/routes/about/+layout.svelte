<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  const cc = {
    header: "fixed inset-x-0 z-20 fluid-grid lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto top-16 font-walsheim",
    nav: "span-content relative flex justify-center items-center",
    logo: "absolute left-0 top-0 bottom-0 rounded-full transition shadow",
    logoLink: "is-zoomInDown flex justify-center items-center size-14 aspect-square text-accent-purple-100",
    list: "flex gap-4 rounded-full text-accent-purple-100 px-8 transition duration-200 shadow ",
    link: "inline-flex py-2.5 px-2.5",
    glass: "isolote backdrop-blur bg-accent-purple-500/50 ring-1 ring-white/50",
    footer:"fluid-grid w-full lg:max-w-[min(calc(100%-4vw),2000px)] left-1/2 -translate-x-1/2 mt-40 z-20 relative bg-[rgba(255,255,255,0.025)]  border-t border-neutral-500/20",
  };
</script>

{@render children?.()}

