<script lang="ts">
  import "@fontsource-variable/bitter";
  import "@fontsource-variable/jetbrains-mono";
  import "@fontsource/poppins/300.css";
  import "@fontsource/poppins/400.css";
  import "@fontsource/poppins/500.css";
  import "@fontsource/poppins/700.css";
  import "$styles/webfonts.css";
  import "$styles/app.css";
  import type { Snippet } from "svelte";
  import { dayjs } from "svelte-time";
  import "dayjs/locale/de";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import Header from "$components/block/Header.svelte";

  dayjs.locale("de");

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  let scrollY = $state(0);

  const cc = {
    footer:"fluid-grid w-full lg:max-w-[min(calc(100%-4vw),2000px)] left-1/2 -translate-x-1/2 mt-40 z-20 relative bg-[rgba(255,255,255,0.025)]  border-t border-neutral-500/20",
  };
</script>

<svelte:window bind:scrollY />

<Header scrollY={scrollY} />

{@render children?.()}

<footer class={cc.footer} use:useWaypoint data-waypoint>
  <div class="span-content py-16 is-zoomInUp" data-waypoint-target>Footer WIP</div>
</footer>
