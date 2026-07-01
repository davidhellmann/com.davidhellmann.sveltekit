<script lang="ts">
  import { tv, type VariantProps } from "$utils/classNames";
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
          slotList:
            "text-accent-purple-100 ring-white/50 bg-accent-purple-500/50 ring-1 shadow-[0_20px_80px] shadow-neutral-900/30"
        },
        photos: {
          slotList: "bg-white/50 text-black ring-1 ring-black/5 shadow-md"
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

  const navigationItems = [
    { href: "/", label: "home.", icon: "home-modern-outline" },
    { href: "/work", label: "work.", icon: "rectangle-group-outline" },
    { href: "/blog", label: "blog.", icon: "document-text-outline" },
    { href: "/photos", label: "photos.", icon: "photo-outline" },
    { href: "/about", label: "about.", icon: "identification-outline" }
  ] as const;

  const matchesPath = (pathname: string, matcher: string) => {
    if (matcher === "/") {
      return pathname === matcher;
    }

    return pathname.startsWith(matcher);
  };

  const isCurrentPage = (matcher: string | string[]) => {
    const pathname = page.url.pathname;
    const matches = Array.isArray(matcher)
      ? matcher.some((prefix) => prefix.length > 1 && pathname.startsWith(prefix))
      : matchesPath(pathname, matcher);

    return matches ? "page" : undefined;
  };
</script>

<nav class={slotNav({ theme, className })} data-comp={compName}>
  <ul class={slotList({ theme })}>
    {#each navigationItems as item (item.href)}
      <li data-waypoint-target class="is-zoomInDown">
        <a class={slotLink({ theme })} aria-current={isCurrentPage(item.href)} href={item.href}>
          <IconSprite className={slotIcon()} size={20} icon={item.icon} />
          <span class="inline-block whitespace-pre">{item.label}</span>
        </a>
      </li>
    {/each}
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
