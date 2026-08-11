<script lang="ts">
  import type { PageProps } from "./$types";
  import StackPhotos from "$components/stacks/Photos.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/seo/Seo.svelte";
  import { useSplitText } from "$lib/actions/action.splitText";

  let { data }: PageProps = $props();

  const entryCount = data.entryCount ?? 1;
  const totalPages = data.totalPages ?? 1;
  let photosEntry = $derived(data.photosEntry);
  let entries = $derived(data.entries);
  let page = $derived(data.page);

  const cc = {
    heading: "span-content text-black text-7xl font-decorative font-extrabold",
    text: "span-content xl:col-start-[col-3] xl:col-end-[col-10] text-2xl is-zoomInDown [&*strong]:decoration-wavy [&*strong]:underline [&*strong]:decoration-4 [&*strong]:decoration-accent-purple-400",
    list: "span-content z-10 @container"
  };
</script>

{#if photosEntry?.seomatic}
  <Seo seo={photosEntry.seomatic} />
{/if}

{#if photosEntry}
  {#key page}
    {#if page === 1}
      {#if photosEntry?.customTitle}
        <h1 class={cc.heading} use:useSplitText={{ direction: "fromTop" }}>
          {#each photosEntry.customTitle.split("$") as line, index (`${line}-${index}`)}
            {#if index > 0}<br />{/if}
            {line}
          {/each}
        </h1>
      {/if}
      {#if photosEntry.description}
        <RichText className={cc.text} html={photosEntry.description} data-waypoint-target />
      {/if}
    {:else}
      <h1
        class="span-content text-black font-decorative text-7xl font-extrabold"
        use:useSplitText={{ direction: "fromTop" }}
      >
        Page {page.toString()}
      </h1>
    {/if}
  {/key}
  <StackPhotos {entries} showPagination={true} totalItems={entryCount} {totalPages} {page} className={cc.list} />
{/if}
