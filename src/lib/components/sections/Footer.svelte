<script lang="ts">
  import { tv, type VariantProps } from "$utils/classNames";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useFullWidthText } from "$lib/actions/action.fullWidthText";

  type FooterServiceIcon = "github" | "instagram" | "twitter" | "linkedin" | "rss";
  type FooterServiceLink = {
    label: string;
    href?: string;
    icon: FooterServiceIcon;
    planned?: boolean;
  };

  const tvFooter = tv({
    slots: {
      slotBase:
        "fluid-grid w-full lg:max-w-[min(calc(100%-4vw),2000px)] left-1/2 -translate-x-1/2 mt-40 z-20 relative overflow-hidden bg-[rgba(255,255,255,0.025)] border-t border-neutral-500/20",
      slotContent:
        "span-content relative z-10 flex min-h-52 flex-col items-center justify-center gap-6 py-20 md:min-h-64 md:py-24",
      slotLinks: "flex flex-wrap items-center justify-center gap-3",
      slotLink:
        "group inline-flex items-center gap-2 rounded-full border border-neutral-500/20 bg-neutral-950/10 px-4 py-2 font-mono text-xs font-semibold text-neutral-700 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-neutral-500/40 hover:bg-white/20 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-purple-700 theme-dark:text-neutral-300 theme-dark:hover:text-white",
      slotLinkPlanned: "pointer-events-none border-dashed opacity-45 grayscale",
      slotIcon: "size-4 shrink-0",
      slotInner: "span-full pointer-events-none inset-x-0 bottom-0 z-0 is-zoomInUp overflow-clip",
      slotBigText: "translate-y-1/4 scale-105 uppercase font-decorative font-extrabold text-transparent text-center"
    }
  });

  const serviceLinks: FooterServiceLink[] = [
    { label: "GitHub", href: "https://github.com/davidhellmann/", icon: "github" },
    { label: "Instagram", href: "https://instagram.com/davidhellmann/", icon: "instagram" },
    { label: "Twitter", href: "https://twitter.com/davidhellmann/", icon: "twitter" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/davidhellmann/", icon: "linkedin" },
    { label: "RSS", icon: "rss", planned: true }
  ];

  type FooterProps = {
    compName?: string;
    className?: string;
    isPhotos?: boolean;
  } & VariantProps<typeof tvFooter>;

  let { compName = "Footer", className, isPhotos = false }: FooterProps = $props();

  const { slotBase, slotContent, slotLinks, slotLink, slotLinkPlanned, slotIcon, slotInner, slotBigText } = tvFooter({
    className
  });
</script>

{#snippet serviceIcon(icon: FooterServiceIcon)}
  <svg viewBox="0 0 24 24" class={slotIcon()} aria-hidden="true">
    {#if icon === "github"}
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.19-3.37-1.19-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.55 9.55 0 0 1 12 7c.85 0 1.7.11 2.5.34 1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.58c0 .27.18.58.69.48A10 10 0 0 0 12 2"
      />
    {:else if icon === "instagram"}
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z"
      />
      <path fill="none" stroke="currentColor" stroke-width="2" d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
      <path fill="currentColor" d="M17.6 6.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0" />
    {:else if icon === "twitter"}
      <path
        fill="currentColor"
        d="M4.5 4h3.73l4.53 6.1L17.95 4h1.86l-6.2 7.28L20.5 20h-3.73l-4.93-6.64L6.19 20H4.34l6.65-7.82L4.5 4Zm2.73 1.37 10.2 13.26h.34L7.58 5.37h-.35Z"
      />
    {:else if icon === "linkedin"}
      <path
        fill="currentColor"
        d="M5.5 8.75H9V20H5.5V8.75Zm1.76-5a2.03 2.03 0 1 1 0 4.06 2.03 2.03 0 0 1 0-4.06ZM11 8.75h3.35v1.54h.05c.47-.89 1.61-1.83 3.31-1.83 3.54 0 4.19 2.33 4.19 5.36V20h-3.49v-5.48c0-1.31-.02-2.99-1.82-2.99-1.82 0-2.1 1.42-2.1 2.89V20H11V8.75Z"
      />
    {:else}
      <path fill="currentColor" d="M6.2 17.35a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z" />
      <path fill="none" stroke="currentColor" stroke-width="2.25" d="M4.5 10.25A9.25 9.25 0 0 1 13.75 19.5" />
      <path fill="none" stroke="currentColor" stroke-width="2.25" d="M4.5 4.25A15.25 15.25 0 0 1 19.75 19.5" />
    {/if}
  </svg>
{/snippet}

<footer
  class={`${slotBase({ className })} ${isPhotos ? "border-t-0" : ""}`}
  data-comp={compName}
  use:useWaypoint
  data-waypoint
>
  <div class={slotContent()}>
    <nav aria-label="Footer service links">
      <ul class={slotLinks()}>
        {#each serviceLinks as item (item.label)}
          <li>
            <svelte:element
              this={item.href ? "a" : "span"}
              href={item.href}
              target={item.href ? "_blank" : undefined}
              rel={item.href ? "noreferrer" : undefined}
              aria-disabled={item.planned ? "true" : undefined}
              title={item.planned ? "RSS feed planned" : undefined}
              data-waypoint-target
              class={`${slotLink()} ${item.planned ? slotLinkPlanned() : ""}`}
            >
              {@render serviceIcon(item.icon)}
              <span>{item.label}</span>
            </svelte:element>
          </li>
        {/each}
      </ul>
    </nav>
  </div>

  <div class={slotInner()}>
    <div class={slotBigText()} use:useFullWidthText>
      <span class="leading-[1]!"
        >LÄUFT
        <div class="absolute left-1/2 -translate-x-1/2 bottom-0 text-neutral-500/5 inline">
          <span data-waypoint-target class="is-blurInLeftDown -translate-y-[1.75cap]">L</span><span
            data-waypoint-target
            class="is-blurInLeftDown -translate-y-[1.75cap]">Ä</span
          ><span data-waypoint-target class="is-blurInLeftDown -translate-y-[1.75cap]">U</span><span
            data-waypoint-target
            class="is-blurInLeftDown -translate-y-[1.75cap]">F</span
          ><span data-waypoint-target class="is-blurInLeftDown -translate-y-[1.75cap]">T</span>
        </div></span
      >
    </div>
  </div>
</footer>
