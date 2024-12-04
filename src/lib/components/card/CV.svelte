<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import Time from "$components/text/Time.svelte";
  import InlineSvg from "$components/ui/InlineSvg.svelte";

  const tvCardCV = tv({
    slots: {
      slotBase:
        "@container text-neutral-50 px-8 md:px-10 py-12 md:py-12 rounded-3xl flex flex-col items-start stack-4 transition-all "
    }
  });

  type CardCVProps = {
    compName?: string;
    className?: string;
    position: string;
    dateStart: string;
    dateEnd?: string;
    currentPosition: boolean;
    company: string;
    companyLogoMonochrome: string;
  } & VariantProps<typeof tvCardCV>;

  let {
    compName = "CardCV",
    className,
    position,
    dateStart,
    dateEnd,
    currentPosition,
    company,
    companyLogoMonochrome
  }: CardCVProps = $props();

  const { slotBase } = tvCardCV({ className });
</script>

{#if position && company && companyLogoMonochrome}
  <div class={slotBase({ className })} data-comp={compName} data-waypoint-target>
    <InlineSvg className={"tetxt-white"} url={companyLogoMonochrome} />
    <Time timestamp={dateStart} format="YYYY" icon={false} />
    {#if dateEnd}
      <Time timestamp={dateEnd} format="YYYY" icon={false} />
    {/if}
    {currentPosition}
    <Headline preset={"h5"} text={position} className="max-w-[22ch]" />
    <Headline preset={"h5"} text={company} className="max-w-[22ch]" />
  </div>
{/if}
