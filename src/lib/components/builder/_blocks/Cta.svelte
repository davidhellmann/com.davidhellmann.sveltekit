<script lang="ts">
  import type {Hyper_DataFragment} from "$lib/graphql/graphql";

  type BlockCta = {
    compName?: string;
    title?: string;
    description?: string;
    links: Hyper_DataFragment[];
  }

  const {
    compName = "BlockCta",
    title,
    description,
    links
  }: BlockCta = $props();
</script>

{#if links}
  <div class="span-content" data-comp={compName}>
    {links}
    {#if title}{title}{/if}
    {#if description}{description}{/if}
  </div>
{/if}
