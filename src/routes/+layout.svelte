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
  import Header from "$components/block/Header.svelte";
  import Footer from "$components/block/Footer.svelte";

  dayjs.locale("de");

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />
<Header scrollY={scrollY} />
{@render children?.()}
<Footer />
