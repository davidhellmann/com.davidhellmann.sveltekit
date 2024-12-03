<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import Image from "$components/image/Image.svelte";
  import Time from "$components/text/Time.svelte";

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
    <div
      style={`mask-image: url('${companyLogoMonochrome}'); mask-size: 100%;`}
      class={"bg-white size-48 mask-size-contain mask-repeat-no-repeat"}
    ></div>
    <Time timestamp={dateStart} format="YYYY" icon={false} />
    {#if dateEnd}
      <Time timestamp={dateEnd} format="YYYY" icon={false} />
    {/if}
    {currentPosition}
    <Headline preset={"h5"} text={position} className="max-w-[22ch]" />
    <Headline preset={"h5"} text={company} className="max-w-[22ch]" />
  </div>
{/if}
