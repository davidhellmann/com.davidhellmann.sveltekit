<script lang="ts">
  import "@fontsource-variable/bitter";
  import "@fontsource-variable/jetbrains-mono";
  import "$styles/webfonts.css";
  import "$styles/app.css";
  import type { Snippet } from "svelte";
  import { dayjs } from "svelte-time";
  import "dayjs/locale/de";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  dayjs.locale("de");

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  let scrollY = $state(0);

  const cc = {
    header: "fixed inset-x-0 z-20 fluid-grid lg:max-w-[min(calc(100%-4vw),2000px)] mx-auto top-16 font-sans",
    nav: "span-content relative flex justify-center items-center",
    logo: "absolute left-0 top-0 bottom-0 rounded-full transition shadow",
    logoLink: "is-zoomInDown flex justify-center items-center size-14 aspect-square text-accent-purple-100",
    list: "flex gap-4 rounded-full text-accent-purple-100 px-8 transition duration-200 shadow ",
    link: "inline-flex py-2.5 px-2.5",
    glass: "isolote backdrop-blur bg-accent-purple-500/50 ring-1 ring-white/50",
    footer:
      "fluid-grid w-full lg:max-w-[min(calc(100%-4vw),2000px)] left-1/2 -translate-x-1/2 mt-40 z-20 relative bg-[rgba(255,255,255,0.025)]  border-t border-neutral-500/20"
  };
</script>

<svelte:window bind:scrollY />

<header class={cc.header}>
  <nav class={`${cc.nav}`} use:useWaypoint={{ endless: true }} data-waypoint>
    <h1 class={`${cc.logo} ${cc.glass} ${scrollY > 100 ? "-translate-y-10 scale-90" : ""}`}>
      <a data-waypoint-target class={cc.logoLink} href="/">DH</a>
    </h1>
    <ul class={`${cc.list} ${cc.glass} ${scrollY > 100 ? "-translate-y-10 scale-90" : ""}`}>
      <li data-waypoint-target class="is-zoomInDown"><a class={cc.link} href="/work">work.</a></li>
      <li data-waypoint-target class="is-zoomInDown"><a class={cc.link} href="/blog">blog.</a></li>
      <li data-waypoint-target class="is-zoomInDown"><a class={cc.link} href="/photos">photos.</a></li>
      <li data-waypoint-target class="is-zoomInDown"><a class={cc.link} href="/about">about.</a></li>
    </ul>
  </nav>
</header>

{@render children?.()}

<footer class={cc.footer} use:useWaypoint data-waypoint>
  <div class="span-content py-16 is-zoomInUp" data-waypoint-target>Footer WIP</div>
</footer>
