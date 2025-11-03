<script lang="ts">
  import type { PageProps } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import type { EntryType_WorkSingleFragment } from "$graphql/graphql";
  import Seo from "$components/seo/Seo.svelte";
  import LightboxWork from "$components/modals/LightboxWork.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  // import ContentBuilder from "$components/builders/ContentBuilder.svelte";

  let { data }: PageProps = $props();
  const entry = $derived(getFirstEntry(data.entries) as EntryType_WorkSingleFragment);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

<Headline className="span-content text-center text-6xl" text={entry.customTitle ?? entry.title ?? ""} />
{#if entry?.projectDescription}
  <RichText className="span-xl md:columns-2 gap-fluid" html={entry.projectDescription} />
{/if}

<!--{#if entry?.contentBuilderWork}-->
<!--  <ContentBuilder-->
<!--    blockTypes={entry?.contentBuilderWork}-->
<!--  />-->
<!--{/if}-->

{#if entry?.images}
  <div class="span-content lg:span-popout @container">
    <LightboxWork images={entry?.images} ratio={"aspect-auto!"} />
  </div>
{/if}

<style>
  @reference "../../../lib/styles/app.css";
  /* Lightbox Styles */
  :global(.lg-container .lg-content) {
    top: 0 !important;
  }
</style>
