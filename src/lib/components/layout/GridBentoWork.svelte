<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type {
    Entry_DataFragment,
    Entry_DatesFragment,
    Entry_SeoFragment,
    EntryType_WorkSingleFragment
  } from "$graphql/graphql";
  import { getColorPickerColors } from "$utils/getColorPickerColors";
  import Image from "$components/image/Image.svelte";
  import PlainText from "$components/text/PlainText.svelte";
  import Headline from "$components/text/Headline.svelte";

  type Entry = Entry_DataFragment & EntryType_WorkSingleFragment & Entry_SeoFragment & Entry_DatesFragment;

  const tvGridBentoWork = tv({
    slots: {
      slotBase: "grid grid-cols-3 grid-rows-4 gap-4 lg:gap-8",
      slotCard: "overflow-clip rounded flex flex-col items-start stack-6 bg-neutral-950/60 border-2 border-neutral-800/50 shadow-lg text-neutral-100 p-4",
      slotCard1: "col-span-1 row-span-2 rounded-tl-3xl",
      slotCard2: "col-span-2 row-span-2 rounded-tr-3xl pl-10 pl-20",
      slotCard3: "col-span-2 row-span-2 rounded-bl-3xl pl-10 md:pl-20",
      slotCard4: "col-span-1 row-span-2 rounded-br-3xl",
      slotContent: "flex flex-col px-8 pt-6",
      slotImage: "w-full h-full aspect-[5/3] rounded-xl overflow-hidden"
    }
  });

  type GridBentoWorkProps = {
    compName?: string;
    className?: string;
    entries: Entry[];
  } & VariantProps<typeof tvGridBentoWork>;

  let {
    compName = "GridBentoWork",
    className,
    entries
  }: GridBentoWorkProps = $props();

  const {
    slotBase,
    slotCard,
    slotCard1,
    slotCard2,
    slotCard3,
    slotCard4,
    slotContent,
    slotImage
  } = tvGridBentoWork({ className });
  const cardClasses = [slotCard1, slotCard2, slotCard3, slotCard4];
</script>

{#if entries}
  <div
    data-comp={compName}
    class={slotBase({ className })}
  >
    {#each entries as entry, i (entry.id)}
      {#if entry && entry?.__typename === "entryWorkSingle_Entry"}
        {#if entry?.title && entry?.url && entry?.descriptionPlain && entry?.image && entry?.colorPickerRepeater}
          <div class={`${slotCard()} ${cardClasses[i]()}`} style={getColorPickerColors(entry?.colorPickerRepeater)}>
            <div class={slotContent()}>
              <Headline
                preset={"h5"}
                text={entry?.title}
                className="max-w-[22ch]"
              />
              <PlainText text={entry?.descriptionPlain} className={"line-clamp-3 text-sm"} />
            </div>
            <Image className={slotImage()} image={entry?.image[0]} focalPoint={[0, 0]} />
          </div>
        {/if}
      {/if}
    {/each}
  </div>
{/if}

