<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import LightboxWork from "$components/modals/LightboxWork.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  // import ContentBuilder from "$components/builders/ContentBuilder.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const entry = getFirstEntry(data.entries);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryWorkSingle_Entry"}
  <Headline className="span-content text-center" size="6xl" text={entry.customTitle ?? entry.title ?? ""} />
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
      <LightboxWork images={entry?.images} ratio={"aspect-auto"} />
    </div>
  {/if}
{/if}

<style>
  @reference "../../../lib/styles/app.css";
  /* Lightbox Styles */
  :global(.lg-container .lg-content) {
    top: 0 !important;
  }
</style>
