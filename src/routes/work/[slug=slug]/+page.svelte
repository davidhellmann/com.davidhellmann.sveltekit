<script lang="ts">
  import type { PageProps } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import type { EntryType_WorkSingleFragment } from "$graphql/graphql";
  import Seo from "$components/seo/Seo.svelte";
  import LightboxWork from "$components/modals/LightboxWork.svelte";
  import HeroWork from "$components/heros/Work.svelte";
  import PrevNext from "$components/navigation/PrevNext.svelte";

  let { data }: PageProps = $props();
  const entry = $derived(getFirstEntry(data.entries) as EntryType_WorkSingleFragment);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

<!-- <HeroWork
  headline={entry?.customTitle ?? entry?.title}
  description={entry?.projectDescription}
  postDate={entry?.postDate}
  workType={entry?.workType?.[0]?.title}
  client={entry?.client?.[0]?.title}
  agency={entry?.agency?.[0]?.title}
  colors={entry?.colors}
/> -->

{#if entry?.images}
  <div class="span-content lg:span-popout @container">
    <LightboxWork images={entry?.images} ratio={"aspect-auto"} />
  </div>
{/if}

<PrevNext prev={entry?.prev} next={entry?.next} theme="work" className="span-content" />

<style>
  @reference "../../../lib/styles/app.css";
  :global(.lg-container .lg-content) {
    top: 0 !important;
  }
</style>
