<script lang="ts">
  import type { Hyper_DataFragment } from "$lib/graphql/graphql";
  import CtaWrapper from "$components/blocks/CtaWrapper.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Link from "$components/text/Link.svelte";
  import IconSprite from "$components/media/IconSprite.svelte";
  import type { HeroiconsIcons } from "$lib/types/heroicons-icons";
  import type { ComponentProps } from "svelte";

  type BlockCta = {
    compName?: string;
    headline?: string;
    description?: string;
    icon?: HeroiconsIcons;
    links: Hyper_DataFragment[];
  };

  const { compName = "BlockCta", headline, description, icon = "face-smile-outline", links }: BlockCta = $props();
</script>

{#if links}
  <CtaWrapper className="span-popout stack-space-24" {compName}>
    {#if headline}
      <Headline text={headline} />
    {/if}
    {#if description}
      <RichText html={description} />
    {/if}
    {#if links}
      <!--TODO: Create Link Group Component (Or Grid) -->
      <div class="flex flex-col xs:flex-row flex-wrap gap-4 stack-space-8 @container">
        {#each links as link (link)}
          {#if link.url && "linkStyle" in link}
            <Link
              text={link.text}
              variant={link?.linkStyle as ComponentProps<typeof Link>["variant"]}
              href={link.url}
            />
          {/if}
        {/each}
      </div>
    {/if}
    <IconSprite size={96} className="absolute right-10 top-10 no-space-y opacity-40" {icon} />
  </CtaWrapper>
{/if}
