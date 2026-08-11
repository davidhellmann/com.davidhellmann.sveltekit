<script lang="ts">
  import type { PageProps } from "./$types";
  import type { Page_WorkListFragment, Page_WorkSingleFragment } from "$graphql/graphql";
  import Seo from "$components/seo/Seo.svelte";
  import GridBentoWork from "$components/containers/GridBentoWork.svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { useSplitText } from "$lib/actions/action.splitText";

  let { data }: PageProps = $props();
  let workEntry = getFirstEntry(data.workEntry) as Page_WorkListFragment;
  let workEntries = data?.workEntries as Page_WorkSingleFragment[];

  const cc = {
    heading: "span-content text-neon-pink text-7xl font-decorative font-extrabold",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&_*_strong]:decoration-wavy [&_*_strong]:underline [&_*_strong]:decoration-4 [&_*_strong]:decoration-accent-purple-400",
    list: "span-popout z-10 @container"
  };
</script>

{#if workEntry?.seomatic}
  <Seo seo={workEntry.seomatic} />
{/if}

{#if workEntry?.customTitle}
  <h1 data-split-text hidden class={cc.heading} use:useSplitText={{ direction: "fromTop" }}>
    {#each workEntry.customTitle.split("$") as line, index (`${line}-${index}`)}
      {#if index > 0}<br />{/if}
      {line}
    {/each}
  </h1>
{/if}

{#if workEntries}
  <GridBentoWork theme="dark" className="span-content -mt-6 mb-24 z-10" entries={workEntries} />
{/if}
