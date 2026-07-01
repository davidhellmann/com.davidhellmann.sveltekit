<script lang="ts">
  import type { ComponentProps } from "svelte";
  import type { Page_WorkSingleFragment } from "$graphql/graphql";
  import LightboxWork from "$components/modals/LightboxWork.svelte";
  import { resolveWorkMediaGroups, type WorkMediaGroup } from "./work-media";

  type WorkMediaProps = {
    compName?: string;
    entry?: Page_WorkSingleFragment;
  };

  const { compName = "WorkMedia", entry }: WorkMediaProps = $props();
  const mediaGroups = $derived(resolveWorkMediaGroups(entry));

  const getImages = (group: WorkMediaGroup): ComponentProps<typeof LightboxWork>["images"] =>
    group.images as ComponentProps<typeof LightboxWork>["images"];
</script>

{#if mediaGroups.length > 0}
  <div data-comp={compName} class="span-full stack-12">
    {#each mediaGroups as group (group.images.map((image) => image.id).join("-"))}
      <div class="span-content lg:span-popout @container">
        <LightboxWork images={getImages(group)} ratio={group.ratio} />
      </div>
    {/each}
  </div>
{/if}
