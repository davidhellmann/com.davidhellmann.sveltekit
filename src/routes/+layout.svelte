<script lang="ts">
  import "@fontsource-variable/bitter";
  import "@fontsource-variable/jetbrains-mono";
  import "@fontsource/poppins/300.css";
  import "@fontsource/poppins/400.css";
  import "@fontsource/poppins/500.css";
  import "@fontsource/poppins/700.css";
  import "$styles/webfonts.css";
  import "$styles/app.css";
  import { onNavigate, afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import { dayjs } from "svelte-time";
  import "dayjs/locale/de";
  import Header from "$components/sections/Header.svelte";
  import Footer from "$components/sections/Footer.svelte";

  dayjs.locale("de");

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  let scrollY = $state(0);

  let isPhotos = $state(page.url.pathname.startsWith("/photos"));

  afterNavigate(() => {
    isPhotos = page.url.pathname.startsWith("/photos");
  });

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:window bind:scrollY />
<Header {scrollY} {isPhotos} />
{@render children?.()}
<Footer {isPhotos} />

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  :root::view-transition-old(root) {
    animation: 300ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
  }

  :root::view-transition-new(root) {
    animation: 300ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in;
  }
</style>
