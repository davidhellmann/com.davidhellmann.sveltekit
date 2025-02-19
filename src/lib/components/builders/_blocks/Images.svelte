<script lang="ts">
  import Image from "$components/media/Image.svelte";
  import Grid from "$components/containers/Grid.svelte";
  import Lightbox from "$components/modals/Lightbox.svelte";
  import ImageGridCalculated from "$components/containers/ImageGridCalculated.svelte";
  import type { ComponentProps } from "svelte";

  type BlockImage = {
    compName?: string;
    images: ComponentProps<typeof Image>["image"][];
    ratio?: ComponentProps<typeof Image>["ratio"];
    showCaption?: boolean;
    imagesViewMode?: string;
  };

  const { compName = "BlockImages", images, ratio, imagesViewMode }: BlockImage = $props();

  type Columns = 1 | 2 | 3 | 4 | 5 | 6;

  const getColumns = (): Columns => {
    let colCount = imagesViewMode?.replace("grid-cols-", "");
    const parsedColCount = colCount ? parseInt(colCount) : 1;

    if ([1, 2, 3, 4, 5, 6].includes(parsedColCount)) {
      return parsedColCount as Columns;
    }

    return 1;
  };
</script>

{#if images}
  <div data-comp={compName} class="span-content lg:span-popout @container">
    {#if imagesViewMode && imagesViewMode.startsWith("grid-cols-")}
      <Grid columns={getColumns()}>
        {#each images as image (image)}
          <Image {image} {ratio} />
        {/each}
      </Grid>
    {:else if imagesViewMode === "gallery"}
      <Lightbox {images} ratio={"aspect-landscape"} />
    {:else if imagesViewMode === "grid-calculated"}
      <ImageGridCalculated {images} />
    {/if}
  </div>
{/if}
