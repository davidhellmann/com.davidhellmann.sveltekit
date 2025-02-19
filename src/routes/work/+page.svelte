<script lang="ts">
  import type { PageData } from "./$types";
  import StackBlog from "$components/stacks/Blog.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/seo/Seo.svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let workEntry = getFirstEntry(data.workEntry);
  let entries = $derived(data.entries);

  const cc = {
    heading: "span-content text-neon-pink is-zoomInDown text-7xl font-decorative font-extrabold flex flex-wrap",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&_*_strong]:decoration-wavy [&_*_strong]:underline [&_*_strong]:decoration-4 [&_*_strong]:decoration-accent-purple-400",
    list: "span-popout z-10 @container"
  };
</script>

{#if workEntry?.seomatic}
  <Seo seo={workEntry.seomatic} />
{/if}

{#if workEntry && workEntry?.__typename === "entryWorkList_Entry"}
  <div class={cc.heading} use:useWaypoint data-waypoint>
    {#if workEntry?.customTitle}
      <!-- eslint-disable-next-line -->
      {@html splitTextIntoDivs(workEntry?.customTitle, "is-blurInLeftDown", "$")}
    {/if}
  </div>

  {#if entries}
    <ul class="span-content flex flex-col gap-1">
      {#each entries as entry (entry.id)}
        <li>
          <a class="flex p-4 bg-neutral-900 rounded-sm transition hover:bg-neutral-800" href={entry.url}
            >{entry.title}</a
          >
        </li>
      {/each}
    </ul>
  {/if}
{/if}
