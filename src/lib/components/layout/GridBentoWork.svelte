<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type {
    Entry_DataFragment,
    Entry_DatesFragment,
    Entry_SeoFragment,
    EntryType_WorkSingleFragment
  } from "$graphql/graphql";
  import { getRandomItemsFromArray } from "$utils/getRandomItemsFromArray";
  import Image from "$components/image/Image.svelte";
  // import PlainText from "$components/text/PlainText.svelte";
  import Headline from "$components/text/Headline.svelte";
  import Category from "$components/text/Category.svelte";
  import Time from "svelte-time";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  type Entry = Entry_DataFragment & EntryType_WorkSingleFragment & Entry_SeoFragment & Entry_DatesFragment;

  const tvGridBentoWork = tv({
    slots: {
      slotBase: "grid grid-cols-3 grid-rows-4 gap-fluid",
      slotCard:
        "overflow-clip rounded-xl flex flex-col items-start relative stack-10 bg-neutral-100 ring-1 ring-black/30 shadow-xl shadow-neutral-700/20 transition-all hover:shadow-2xl hover:shadow-neutral-700/50 hover:-translate-y-0.5",
      slotCard1: "col-span-1 row-span-2 [&_.imageWrapper]:pb-0 [&_.imageWrapper]:pl-6 [&_.imageWrapper]:pr-0 [&_img]:rounded-b-none [&_img]:rounded-tr-none",
      slotCard2: "col-span-2 row-span-2 [&_.imageWrapper]:pb-0 [&_.imageWrapper]:px-6 [&_img]:rounded-b-none",
      slotCard3: "col-span-2 row-span-2 [&_.imageWrapper]:pb-0 [&_.imageWrapper]:px-6 [&_img]:rounded-b-none",
      slotCard4: "col-span-1 row-span-2 [&_.imageWrapper]:pb-0 [&_.imageWrapper]:pr-6 [&_.imageWrapper]:pl-0 [&_img]:rounded-b-none [&_img]:rounded-tl-none",
      slotContent: "flex flex-col px-10 pt-10 stack-3",
      slotImageWrapper: "imageWrapper w-full h-full pb-3 px-3",
      slotImage: "w-full h-full aspect-[3/1.8] ring-1 ring-neutral-600/20 rounded-lg shadow-xl"
    }
  });

  type GridBentoWorkProps = {
    compName?: string;
    className?: string;
    entries: Entry[];
  } & VariantProps<typeof tvGridBentoWork>;

  let { compName = "GridBentoWork", className, entries }: GridBentoWorkProps = $props();

  const { slotBase, slotCard, slotCard1, slotCard2, slotCard3, slotCard4, slotContent, slotImageWrapper, slotImage } = tvGridBentoWork({
    className
  });
  const cardClasses = [slotCard1, slotCard2, slotCard3, slotCard4];
</script>

{#if entries}
  <div data-comp={compName} class={slotBase({ className })} use:useWaypoint={{endless: true}} data-waypoint>
    {#each getRandomItemsFromArray(entries, 4) as entry, i (entry.id)}
      {#if entry && entry?.__typename === "entryWorkSingle_Entry"}
        {#if entry?.title && entry?.url}
          <a
            href={entry?.url}
            class={`${slotCard()} ${cardClasses[i]()} is-zoomInUp`}
            data-waypoint-target
          >
            <div class={slotContent()}>
              {#if entry?.workType.length > 0}
                <Category className={"mb-3"} variant="work" title={entry.workType[0].title} />
              {/if}
              <Headline preset={"h4"} weight={"medium"} text={entry?.title} className="font-sans" />
              {#if entry?.descriptionPlain}
<!--            <PlainText text={entry?.descriptionPlain} className={"line-clamp-2 text-sm font-sans max-w-prose"} />-->
              {/if}

              <div class="font-mono text-xs flex flex-col">
                {#if entry?.postDate}
                  <span>
                    <span class="text-neutral-400">Y.</span>
                    <Time format="YYYY" class="font-medium uppercase tracking-wider text-neutral-600" timestamp={entry?.postDate} />
                  </span>
                {/if}
                {#if entry?.client.length > 0}
                  <span>
                    <span class="text-neutral-400">C.</span>
                    <span class="font-medium uppercase tracking-wider text-neutral-600">{entry.client[0].title}</span>
                  </span>
                {/if}
                {#if entry?.agency.length > 0}
                  <span>
                    <span class="text-neutral-400">A.</span>
                    <span class="font-medium uppercase tracking-wider text-neutral-600">{entry.agency[0].title}</span>
                  </span>
                {/if}
              </div>
            </div>
            {#if entry?.image}
              <div class={slotImageWrapper()} >
                <Image className={slotImage()} image={entry?.image[0]} ratio="unset" focalPoint={[0, 0]} />
              </div>
            {/if}
          </a>
        {/if}
      {/if}
    {/each}
  </div>
{/if}
