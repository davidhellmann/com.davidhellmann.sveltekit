<script lang="ts">
  import { tv, type VariantProps } from "$utils/classNames";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Time from "svelte-time";

  const tvHeroWork = tv({
    slots: {
      slotWrapper: "stack-12 span-content",
      slotHeadline: "text-center text-6xl",
      slotDescription: "md:columns-2 gap-fluid xl:w-5/6 xl:mx-auto",
      slotMeta:
        "gap-x-6 gap-y-2 border-dashed border-neutral-700 flex items-center justify-center flex-wrap font-mono text-xs",
      slotCategory: "text-neutral-400",
      slotCategoryText: "font-medium uppercase tracking-wider text-neutral-600",
      slotColors:
        "flex items-center justify-center gap-4 font-mono text-center text-neutral-600 text-sm uppercase stack-space-6 mb-16",
      slotColorField: "aspect-square w-8 rounded-full outline outline-neutral-800 outline-offset-2"
    }
  });

  type HeroWorkProps = {
    compName?: string;
    className?: string;
    headline?: string;
    description?: string;
    postDate?: string;
    workType?: string;
    client?: string;
    agency?: string;
    colors?: { color?: string }[];
  } & VariantProps<typeof tvHeroWork>;

  const {
    compName = "HeroWork",
    className,
    headline,
    description,
    postDate,
    workType,
    client,
    agency,
    colors
  }: HeroWorkProps = $props();

  const {
    slotWrapper,
    slotMeta,
    slotDescription,
    slotHeadline,
    slotCategory,
    slotCategoryText,
    slotColors,
    slotColorField
  } = tvHeroWork();
</script>

<header data-comp={compName} class={slotWrapper({ className })}>
  <div class={slotMeta()}>
    {#if workType}
      <div>
        <span class={slotCategory()}>T.</span>
        <span class={slotCategoryText()}>{workType}</span>
      </div>
    {/if}
    {#if postDate}
      <div>
        <span class={slotCategory()}>Y.</span>
        <Time format="YYYY" class={slotCategoryText()} timestamp={postDate} />
      </div>
    {/if}
    {#if client}
      <div>
        <span class={slotCategory()}>C.</span>
        <span class={slotCategoryText()}>{client}</span>
      </div>
    {/if}
    {#if agency}
      <div>
        <span class={slotCategory()}>A.</span>
        <span class={slotCategoryText()}>{agency}</span>
      </div>
    {/if}
  </div>
  {#if colors && colors?.length > 0}
    <div class={slotColors()}>
      {#each colors as color, i (color)}
        <div class={slotColorField()} style={`background-color: ${color?.color};`}></div>
      {/each}
    </div>
  {/if}
  {#if headline}
    <Headline text={headline} tag="h1" className={slotHeadline()} />
  {/if}
  {#if description}
    <RichText className={slotDescription()} html={description} />
  {/if}
</header>
