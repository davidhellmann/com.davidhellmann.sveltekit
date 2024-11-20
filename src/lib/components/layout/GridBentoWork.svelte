<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type {
    Entry_DataFragment,
    Entry_DatesFragment,
    Entry_SeoFragment,
    EntryType_WorkSingleFragment
  } from "$graphql/graphql";
  import { getColorPickerColors } from "$utils/getColorPickerColors";
  import { getRandomItemsFromArray } from "$utils/getRandomItemsFromArray";
  import Image from "$components/image/Image.svelte";
  import PlainText from "$components/text/PlainText.svelte";
  import Headline from "$components/text/Headline.svelte";
  import Category from "$components/text/Category.svelte";

  type Entry = Entry_DataFragment & EntryType_WorkSingleFragment & Entry_SeoFragment & Entry_DatesFragment;

  const tvGridBentoWork = tv({
    slots: {
      slotBase: "grid grid-cols-3 grid-rows-4 gap-fluid",
      slotCard:
        "overflow-clip rounded-xl flex flex-col items-start stack-10 bg-neutral-950/60 ring-1 ring-black/30 shadow-xl shadow-neutral-700/20 text-neutral-100 p-3 transition-all hover:shadow-2xl hover:shadow-neutral-700/50 hover:-translate-y-0.5",
      slotCard1: "col-span-1 row-span-2",
      slotCard2: "col-span-2 row-span-2",
      slotCard3: "col-span-2 row-span-2",
      slotCard4: "col-span-1 row-span-2",
      slotContent: "flex flex-col px-4 pt-6 stack-3",
      slotImage: "w-full h-full aspect-[5/2] ring-1 ring-neutral-600/20 rounded-lg shadow-xl overflow-hidden"
    }
  });

  type GridBentoWorkProps = {
    compName?: string;
    className?: string;
    entries: Entry[];
  } & VariantProps<typeof tvGridBentoWork>;

  let { compName = "GridBentoWork", className, entries }: GridBentoWorkProps = $props();

  const { slotBase, slotCard, slotCard1, slotCard2, slotCard3, slotCard4, slotContent, slotImage } = tvGridBentoWork({
    className
  });
  const cardClasses = [slotCard1, slotCard2, slotCard3, slotCard4];
</script>

{#if entries}
  <div data-comp={compName} class={slotBase({ className })}>
    {#each getRandomItemsFromArray(entries, 4) as entry, i (entry.id)}
      {#if entry && entry?.__typename === "entryWorkSingle_Entry"}
        {#if entry?.title && entry?.url && entry?.colorPickerRepeater}
          <a
            href={entry?.url}
            class={`${slotCard()} ${cardClasses[i]()}`}
            style={getColorPickerColors(entry?.colorPickerRepeater)}
          >
            <div class={slotContent()}>
              {#if entry?.workType?.[0]}
                <Category className={"mb-3"} variant="work" title={entry?.workType?.[0]?.title} />
              {/if}
              <Headline preset={"h6"} weight={"medium"} text={entry?.title} className="font-sans" />
              {#if entry?.descriptionPlain}
                <PlainText text={entry?.descriptionPlain} className={"line-clamp-2 text-sm font-sans max-w-prose"} />
              {/if}
            </div>
            {#if entry?.image}
              <Image className={slotImage()} image={entry?.image[0]} ratio="unset" focalPoint={[0, 0]} />
            {/if}
          </a>
        {/if}
      {/if}
    {/each}
  </div>
{/if}
