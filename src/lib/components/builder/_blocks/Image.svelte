<script lang="ts">
  import type {Asset_DataFragment, Asset_TransformsFragment, Asset_CustomFieldsFragment} from "$lib/graphql/graphql";

  type BlockImage = {
    image: Asset_DataFragment & Asset_TransformsFragment & Asset_CustomFieldsFragment;
    imageRatio?: string;
    showCaption?: boolean;
  }

  const {
    image,
    imageRatio,
    showCaption,
  }: BlockImage = $props();
</script>

{#if image}
  <div class="span-content">
    {image}
    {#if imageRatio}{imageRatio}{/if}
    {#if showCaption}{showCaption}{/if}
  </div>
{/if}
