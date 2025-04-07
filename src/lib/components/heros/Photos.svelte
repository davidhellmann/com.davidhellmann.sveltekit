<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import IconSprite from "$components/media/IconSprite.svelte";

  const tvHeroPhotos = tv({
    slots: {
      slotWrapper: "span-xl text-black flex items-start gap-8",
      slotHeadline: "max-w-[20ch] text-3xl font-sans font-extrabold",
      slotGearList: "font-mono text-xs font-medium text-neutral-400"
    }
  });

  type HeroPhotosProps = {
    compName?: string;
    className?: string;
    headline: string;
    exif: { cameras: string[]; lenses: string[] };
  } & VariantProps<typeof tvHeroPhotos>;

  const { compName = "HeroPhotos", className, headline, exif }: HeroPhotosProps = $props();

  const { slotWrapper, slotHeadline, slotGearList } = tvHeroPhotos();
</script>

{#if headline}
  <header data-comp={compName} class={slotWrapper({ className })}>
    <div>
      <Headline text={headline} tag="h1" className={slotHeadline()} />
      <div class="flex gap-8 mt-2">
        {#if exif.cameras}
          <span class={slotGearList()}>{exif.cameras.join(", ")}</span>
        {/if}
        {#if exif.lenses}
          <span class={slotGearList()}>{exif.lenses.join(", ")}</span>
        {/if}
      </div>
    </div>
  </header>
{/if}
