<script lang="ts">
  import type { PageData } from "./$types";
  import StackBlog from "$components/stacks/Blog.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/seo/Seo.svelte";
  import GridBentoWork from "$components/containers/GridBentoWork.svelte";
  import type { ComponentProps } from "svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { splitTextIntoDivs } from "$utils/splitTextIntoDivs";
  import { useWaypoint } from "$lib/actions/action.waypoint";
  import { useJumpingLetters } from "$lib/actions/action.jumpingLetters";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let workEntry = getFirstEntry(data.workEntry);
  let workEntries = data?.workEntries as ComponentProps<typeof GridBentoWork>["entries"];

  const cc = {
    heading: "span-content text-neon-pink is-zoomInDown text-7xl font-decorative font-extrabold flex flex-wrap",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&_*_strong]:decoration-wavy [&_*_strong]:underline [&_*_strong]:decoration-4 [&_*_strong]:decoration-accent-purple-400",
    list: "span-popout z-10 @container"
  };

  let letters = $derived(splitTextIntoDivs(workEntry?.customTitle, "is-blurInLeftDown", "$"));
</script>

{#if workEntry?.seomatic}
  <Seo seo={workEntry.seomatic} />
{/if}

{#if workEntry && workEntry?.__typename === "entryWorkList_Entry"}
  <div class={cc.heading} use:useWaypoint data-waypoint use:useJumpingLetters>
    {#if workEntry?.customTitle}
      <!-- eslint-disable-next-line -->
      {@html letters}
    {/if}
  </div>

  {#if workEntries}
    <GridBentoWork theme="dark" className={"span-content -mt-6 mb-24 z-10"} entries={workEntries} />
  {/if}
{/if}
