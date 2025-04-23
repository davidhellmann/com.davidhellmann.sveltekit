<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type {
    Entry_DataFragment,
    Entry_DatesFragment,
    Entry_SeoFragment,
    EntryType_WorkSingleFragment
  } from "$graphql/graphql";
  import { getRandomItemsFromArray } from "$utils/getRandomItemsFromArray";
  import Image from "$components/media/Image.svelte";
  // import PlainText from "$components/text/PlainText.svelte";
  import Headline from "$components/text/Headline.svelte";
  import Category from "$components/text/Category.svelte";
  import Time from "svelte-time";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  type Entry = Entry_DataFragment & EntryType_WorkSingleFragment & Entry_SeoFragment & Entry_DatesFragment;

  const tvGridBentoWork = tv({
    slots: {
      slotBase: "grid sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-4 gap-8 md:gap-fluid",
      slotCard:
        "overflow-clip rounded-xl flex flex-col items-start relative stack-10 ring-1 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5",
      slotCard1:
        "col-span-1 lg:row-span-2 [&_.imageWrapper]:pb-0 [&_.imageWrapper]:px-6 [&_img]:rounded-b-none lg:[&_.imageWrapper]:pb-0 lg:[&_.imageWrapper]:pl-6 lg:[&_.imageWrapper]:pr-0 lg:[&_img]:rounded-b-none lg:[&_img]:rounded-tr-none",
      slotCard2: "lg:col-span-2 lg:row-span-2 [&_.imageWrapper]:pb-0 [&_.imageWrapper]:px-6 [&_img]:rounded-b-none",
      slotCard3: "lg:col-span-2 lg:row-span-2 [&_.imageWrapper]:pb-0 [&_.imageWrapper]:px-6 [&_img]:rounded-b-none",
      slotCard4:
        "col-span-1 lg:row-span-2 [&_.imageWrapper]:pb-0 [&_.imageWrapper]:px-6 [&_img]:rounded-b-none lg:[&_.imageWrapper]:pb-0 lg:[&_.imageWrapper]:pr-6 lg:[&_.imageWrapper]:pl-0 lg:[&_img]:rounded-b-none lg:[&_img]:rounded-tl-none",
      slotContent: "flex flex-col px-10 pt-10 stack-3",
      slotImageWrapper: "imageWrapper w-full h-full pb-3 px-3",
      slotImage: "w-full h-full aspect-[3/1.8] ring-1 ring-neutral-600/20 rounded-lg shadow-xl"
    },
    variants: {
      theme: {
        light: {
          slotBase: "text-neutral-500",
          slotCard: "bg-neutral-100 ring-black/30 shadow-neutral-700/20 hover:shadow-neutral-700/50"
        },
        dark: {
          slotBase: "text-neutral-100",
          slotCard: "bg-neutral-900 ring-neutral-800/80 shadow-neutral-700/20 hover:shadow-neutral-700/50"
        }
      }
    }
  });

  type GridBentoWorkProps = {
    compName?: string;
    className?: string;
    entries: Entry[];
    limit?: number;
    random?: boolean;
  } & VariantProps<typeof tvGridBentoWork>;

  let {
    compName = "GridBentoWork",
    className,
    entries,
    limit,
    random = false,
    theme = "light"
  }: GridBentoWorkProps = $props();

  const { slotBase, slotCard, slotCard1, slotCard2, slotCard3, slotCard4, slotContent, slotImageWrapper, slotImage } =
    tvGridBentoWork({ className });
  const cardClasses = [slotCard1, slotCard2, slotCard3, slotCard4];

  let finalEntries = $state(entries);
  if (random && limit) {
    finalEntries = getRandomItemsFromArray(entries, limit);
  }
</script>

{#if entries}
  <div data-comp={compName} data-theme={theme} class={slotBase({ theme, className })} use:useWaypoint data-waypoint>
    {#each finalEntries as entry, i (entry.id)}
      {#if entry && entry?.__typename === "entryWorkSingle_Entry"}
        {#if entry?.title && entry?.url}
          <a
            href={entry?.url}
            class={`${slotCard({ theme })} ${cardClasses[i % cardClasses.length]()} is-zoomInUp`}
            data-waypoint-target
          >
            <div class={slotContent()}>
              {#if entry?.workType.length > 0}
                <Category className={"mb-3"} variant="work" title={entry.workType[0].title} />
              {/if}
              <Headline preset={"h4"} text={entry?.title} className="font-sans font-medium" />
              {#if entry?.descriptionPlain}
                <!--            <PlainText text={entry?.descriptionPlain} className={"line-clamp-2 text-sm font-sans max-w-prose"} />-->
              {/if}

              <div class="font-mono text-xs flex flex-col">
                {#if entry?.postDate}
                  <span>
                    <span class="text-neutral-400">Y.</span>
                    <Time
                      format="YYYY"
                      class="font-medium uppercase tracking-wider text-neutral-600"
                      timestamp={entry?.postDate}
                    />
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
              <div class={slotImageWrapper()}>
                <Image className={slotImage()} image={entry?.image[0]} ratio="unset" focalPoint={[0, 0]} />
              </div>
            {/if}
          </a>
        {/if}
      {/if}
    {/each}
  </div>
{/if}
