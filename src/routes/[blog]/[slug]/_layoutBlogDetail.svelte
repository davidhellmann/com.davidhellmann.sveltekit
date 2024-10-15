<script lang="ts">
  import {tv, type VariantProps} from "tailwind-variants";
  import {type Snippet} from "svelte";

  const tvLayoutBlogDetail = tv({
    slots: {
      slotGrid: "w-screen min-h-dvh grid lg:grid-cols-blog-detail",
      slotMain: "bg-neutral-100",
      slotAside: "bg-neutral-050 f-full order-first lg:order-last px-fluid-grid-gap",
    },
  });

  type LayoutBlogDetailProps = {
    compName?: string;
    className?: string;
    content: Snippet;
    aside: Snippet;
  } & VariantProps<typeof tvLayoutBlogDetail>;

  const {
    compName = "LayoutBlogDetail",
    className,
    content,
    aside
  }: LayoutBlogDetailProps = $props();

  const {slotGrid, slotMain, slotAside} = tvLayoutBlogDetail();
</script>
  <section
    data-comp={compName}
    data-testid={compName}
    class={slotGrid({ className })}
  >
  <main class={slotMain()}>{@render content?.()}</main>
  <aside class={slotAside()}>{@render aside?.()}</aside>
</section>
