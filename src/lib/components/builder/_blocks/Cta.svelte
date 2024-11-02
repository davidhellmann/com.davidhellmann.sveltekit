<script lang="ts">
  import type {Hyper_DataFragment} from "$lib/graphql/graphql";
  import CtaWrapper from "$components/wrapper/CtaWrapper.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Link from "$components/text/Link.svelte";

  type BlockCta = {
    compName?: string;
    headline?: string;
    description?: string;
    links: Hyper_DataFragment[];
  }

  const {
    compName = "BlockCta",
    headline,
    description,
    links
  }: BlockCta = $props();
</script>

{#if links}
  <CtaWrapper className="span-content stack-space-24" data-comp={compName}>
    {#if headline}
      <Headline text={headline} />
    {/if}
    {#if description}
      <RichText html={description} />
    {/if}
    {#if links}
      <!--TODO: Create Link Group Component (Or Grid) -->
      <div class="flex flex-row gap-4 stack-space-8">
        {#each links as link (link)}
          <Link text={link.text} variant={link.linkStyle} href={link.url} />
        {/each}
      </div>
    {/if}
  </CtaWrapper>
{/if}
