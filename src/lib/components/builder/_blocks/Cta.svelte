<script lang="ts">
  import type {Hyper_DataFragment} from "$lib/graphql/graphql";

  type BlockCta = {
    title?: string;
    description?: string;
    links: Hyper_DataFragment[];
  }

  const {
    title,
    description,
    links
  }: BlockCta = $props();
</script>

{#if links}
  <div class="span-content">
    {links}
    {#if title}{title}{/if}
    {#if description}{description}{/if}
  </div>
{/if}
