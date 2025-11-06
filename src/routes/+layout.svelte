<script lang="ts">
  import "@fontsource-variable/bitter";
  import "@fontsource-variable/jetbrains-mono";
  import "@fontsource/poppins/300.css";
  import "@fontsource/poppins/400.css";
  import "@fontsource/poppins/500.css";
  import "@fontsource/poppins/700.css";
  import "$styles/webfonts.css";
  import "$styles/app.css";
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { dayjs } from "svelte-time";
  import "dayjs/locale/de";
  import Header from "$components/sections/Header.svelte";
  import Footer from "$components/sections/Footer.svelte";
  import type { LayoutProps } from "./$types";

  dayjs.locale("de");

  let { children }: LayoutProps = $props();
  let scrollY = $state(0);

  let isPhotos = $derived(page.url.pathname.startsWith("/photos"));
  let isHome = $derived(page.url.pathname === "/");

  // Manage body classes reactively
  $effect(() => {
    if (isHome) {
      document.body.classList.add("is-home");
    } else {
      document.body.classList.remove("is-home");
    }

    if (isPhotos) {
      document.body.classList.add("is-photos");
    } else {
      document.body.classList.remove("is-photos");
    }
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
<svelte:body class:is-home={isHome} class:is-photos={isPhotos} />
<Header {scrollY} {isPhotos} />
{@render children?.()}
<Footer {isPhotos} />

<style>
  @reference "../lib/styles/app.css";

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

  /* Body background styles - dynamically applied based on route */
  :global(body.is-home) {
    background-color: theme("colors.neutral.300");
    background-image: url($lib/images/bg-triangle-gray.avif);
    background-attachment: fixed;
  }

  :global(body.is-photos) {
    background-color: var(--color-white);
    background-image: none;
  }
</style>
