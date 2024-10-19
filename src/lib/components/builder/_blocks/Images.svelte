<script lang="ts">
  import Image from "$components/image/Image.svelte";
  import Grid from "$components/layout/Grid.svelte";
  import Figure from "$components/wrapper/Figure.svelte";
  import type { ComponentProps } from "svelte";

  type BlockImage = {
    compName?: string;
    images: ComponentProps<typeof Image>["image"][];
    imageRatio?: ComponentProps<typeof Image>["ratio"];
    showCaption?: boolean;
    imagesViewMode?: string;
  }

  const {
    compName = "BlockImages",
    images,
    imageRatio,
    imagesViewMode
  }: BlockImage = $props();

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
  <div data-comp={compName} class="span-popout @container">
    {#if imagesViewMode && imagesViewMode.startsWith("grid-cols-")}
      <Grid columns={getColumns()} >
        {#each images as image (image)}
          <Figure>
            <Image image={image} ratio={imageRatio} />
          </Figure>
        {/each}
      </Grid>
    {/if}
  </div>
{/if}
