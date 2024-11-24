<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import IconSprite from "$components/ui/IconSprite.svelte";

  const tvNavigationMain = tv({
    slots: {
      slotNav: "",
      slotList: "flex sm:gap-2 lg:gap-4 rounded-full text-accent-purple-100 px-2 sm:px-4 lg:px-8 shadow isolote backdrop-blur bg-accent-purple-500/50 ring-1 ring-white/50",
      slotLink: "inline-flex py-2.5 px-2.5 flex-col lg:flex-row items-center text-2xs xs:text-xs sm:text-sm lg:text-base gap-x-2.5 gap-y-1 font-bold md:font-normal font-sans md:font-walsheim",
      slotIcon: "",
    }
  });

  type NavigationMainProps = {
    compName?: string;
    className?: string;
  } & VariantProps<typeof tvNavigationMain>;

  const {
    compName = "NavigationMain",
    className,
  }: NavigationMainProps = $props();

  const {
    slotNav,
    slotList,
    slotLink,
    slotIcon
  } = tvNavigationMain({ className });
</script>


<nav class={`${slotNav({ className })}`} data-comp={compName}>
  <ul class={`${slotList()}`}>
    <li data-waypoint-target class="is-zoomInDown md:hidden">
      <a class={`${slotLink()}`} href="/">
        <IconSprite className={slotIcon()} size={20} icon="home-modern-outline" />
        <span class="hidden xs:inline-block">home.</span>
      </a>
    </li>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink()} href="/work">
        <IconSprite className={slotIcon()} size={20} icon="rectangle-group-outline" />
        <span class="hidden xs:inline-block">work.</span>
      </a>
    </li>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink()} href="/blog">
        <IconSprite className={slotIcon()} size={20} icon="document-text-outline" />
        <span class="hidden xs:inline-block">blog.</span>
      </a>
    </li>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink()} href="/projects">
        <IconSprite className={slotIcon()} size={20} icon="rectangle-stack-outline" />
        <span class="hidden xs:inline-block">projects.</span>
      </a>
    </li>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink()} href="/photos">
        <IconSprite className={slotIcon()} size={20} icon="photo-outline" />
        <span class="hidden xs:inline-block">photos.</span>
      </a>
    </li>
    <li data-waypoint-target class="is-zoomInDown">
      <a class={slotLink()} href="/about">
        <IconSprite className={slotIcon()} size={20} icon="identification-outline" />
        <span class="hidden xs:inline-block">about.</span>
      </a>
    </li>
  </ul>
</nav>
