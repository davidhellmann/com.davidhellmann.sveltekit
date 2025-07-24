<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/media/IconSprite.svelte";
  import { page } from "$app/state";

  const tvNavigationMain = tv({
    slots: {
      slotNav: "h-full",
      slotList: "flex sm:gap-2 xl:gap-4 rounded-full px-2 sm:px-4 xl:px-8 shadow-sm isolote backdrop-blur-sm h-full",
      slotLink:
        "inline-flex px-2.5 sm:pt-1 !leading-none flex-col justify-center xl:flex-row items-center text-2xs xs:text-xs sm:text-sm xl:text-base gap-x-2.5 gap-y-1 font-bold md:font-normal font-sans md:font-decorative h-full relative transition-none",
      slotIcon: "size-6 xs:size-5 xl:-translate-y-0.5"
    },
    variants: {
      theme: {
        default: {
          slotList: "text-accent-purple-100 ring-white/50 bg-accent-purple-500/50 ring-1"
        },
        photos: {
          slotList: "bg-white/50 text-black ring-1 ring-black"
        }
      }
    }
  });

  type NavigationMainProps = {
    compName?: string;
    className?: string;
  } & VariantProps<typeof tvNavigationMain>;

  const { compName = "NavigationMain", className, theme = "default" }: NavigationMainProps = $props();
  const { slotNav, slotList, slotLink, slotIcon } = tvNavigationMain();

  const isCurrentPage = (matcher: string | string[]) => {
    const pathname = page.url.pathname;

    if (Array.isArray(matcher)) {
      return matcher.some((prefix) => pathname.startsWith(prefix) && prefix.length > 1) ? "page" : undefined;
    }

    if (matcher === "/") {
      return pathname === matcher ? "page" : undefined;
    }

    return pathname.startsWith(matcher) ? "page" : undefined;
  };
</script>

<nav class={`${slotNav({ theme, className })}`} data-comp={compName}>
  <ul class={`${slotList({ theme })}`}>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={`${slotLink({ theme })}`} aria-current={isCurrentPage("/")} href="/">
        <IconSprite className={slotIcon()} size={20} icon="home-modern-outline" />
        <span class="hidden xs:inline-block">home.</span>
      </a>
    </li>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink({ theme })} aria-current={isCurrentPage("/work")} href="/work">
        <IconSprite className={slotIcon()} size={20} icon="rectangle-group-outline" />
        <span class="hidden xs:inline-block">work.</span>
      </a>
    </li>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink({ theme })} aria-current={isCurrentPage("/blog")} href="/blog">
        <IconSprite className={slotIcon()} size={20} icon="document-text-outline" />
        <span class="hidden xs:inline-block">blog.</span>
      </a>
    </li>
    <!-- <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink({ theme })} aria-current={isCurrentPage("/projects")} href="/projects">
        <IconSprite className={slotIcon()} size={20} icon="rectangle-stack-outline" />
        <span class="hidden xs:inline-block">projects.</span>
      </a>
    </li> -->
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink({ theme })} aria-current={isCurrentPage("/photos")} href="/photos">
        <IconSprite className={slotIcon()} size={20} icon="photo-outline" />
        <span class="hidden xs:inline-block">photos.</span>
      </a>
    </li>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink({ theme })} aria-current={isCurrentPage("/about")} href="/about">
        <IconSprite className={slotIcon()} size={20} icon="identification-outline" />
        <span class="hidden xs:inline-block">about.</span>
      </a>
    </li>
  </ul>
</nav>

<style>
  a[aria-current="page"]::before {
    content: "";
    position: absolute;
    width: calc(100% - 20px);
    height: 3px;
    border-radius: 8px;
    background-color: currentColor;
    bottom: 0;
    left: 50%;
    translate: -50% 2px;
    view-transition-name: active-page;
  }
</style>
