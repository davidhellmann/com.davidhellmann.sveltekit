<script lang="ts">
  import { onMount } from "svelte";
  import "@fontsource-variable/bitter";
  import "@fontsource-variable/jetbrains-mono";
  import "$styles/webfonts.css";
  import "$styles/app.css";
  import type { Snippet } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { lazyLoad } from "unlazy";
  import { dayjs } from "svelte-time";
  import "dayjs/locale/de";
  import waypointObserver from "$utils/waypointObserver";

  dayjs.locale("de");

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  let scrollY = $state(0);

  const loadWayoints = () => {
    const waypointEls = document.querySelectorAll<HTMLElement>("[data-waypoint]");
    if (waypointEls.length > 0) {
      waypointObserver.init(waypointEls);
    }
  };

  onMount(() => {
    loadWayoints();
    lazyLoad("[data-lazy=true]");
  });

  afterNavigate(() => {
    loadWayoints();
    lazyLoad("[data-lazy=true]");
  });

  const cc = {
    header: "fixed inset-x-0 z-20 fluid-grid top-20 font-sans",
    nav: "span-content relative flex justify-center items-center",
    logo: "absolute left-0 top-0 bottom-0 rounded-full transition shadow",
    logoLink: "flex justify-center items-center h-full aspect-square text-accent-purple-100",
    list: "flex gap-4 rounded-full text-accent-purple-100 px-8 transition duration-200 shadow ",
    link: "inline-flex py-2.5 px-2.5",
    glass: "isolote backdrop-blur bg-accent-purple-500/50 ring-1 ring-white/50",

    footer: "fluid-grid w-full max-w-[min(calc(100%-4vw),2000px)] left-1/2 -translate-x-1/2 mt-40 z-20 relative bg-neutral-100/50  border-t border-neutral-300"
  };
</script>

<svelte:window bind:scrollY={scrollY} />

<header class={cc.header}>
  <nav class={`${cc.nav}`}>
    <h1 class={`${cc.logo} ${cc.glass} ${scrollY > 100 ? "-translate-y-12 scale-90" : ""}`}>
      <a class={cc.logoLink} href="/">DH</a>
    </h1>
    <ul class={`${cc.list} ${cc.glass} ${scrollY > 100 ? "-translate-y-12 scale-90" : ""}`}>
      <li><a class={cc.link} href="/work">work.</a></li>
      <li><a class={cc.link} href="/blog">blog.</a></li>
      <li><a class={cc.link} href="/photos">photos.</a></li>
      <li><a class={cc.link} href="/about">about.</a></li>
    </ul>
  </nav>
</header>

{@render children?.()}

<footer class={cc.footer}>
  <div class="span-content py-12">
    Footer WIP
  </div>
</footer>
