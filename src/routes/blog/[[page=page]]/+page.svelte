<script lang="ts">
  import type { PageData } from "./$types";
  import StackBlog from "$components/stack/Blog.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/head/Seo.svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import { afterNavigate } from "$app/navigation";
  import { replaceState } from "$app/navigation";
  import { useWaypoint } from "$lib/actions/action.waypoint";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const entryCount = data.entryCount ?? 1;
  const totalPages = data.totalPages ?? 1;
  let blogEntry = getFirstEntry(data.blogEntry);
  let entries = $derived(data.entries);
  let page = $derived(data.page);

  afterNavigate(() => {
    if (page === 1) {
      replaceState("/blog", {});
    }
  });

  const cc = {
    heading: "span-content text-olkch-pink is-zoomInDown",
    text: "col-start-[col-3] col-end-[col-10] text-2xl is-zoomInDown",
    list: "span-popout z-10 @container",
    underline: "underline decoration-wavy decoration-4 decoration-accent-purple-400"
  };

  const content = {
    heading: "WRITING ABOUT …",
    about: `<p>…things I’m interested in—<br><strong class="${cc.underline}">stories</strong> from my <strong class="${cc.underline}">life</strong>, <strong class="${cc.underline}">adventures</strong> with my <strong class="${cc.underline}">bikes</strong>, <strong class="${cc.underline}">gadgets</strong>, and so on.</p>`
  };

  // split string and map each letter into a div
  const splitText = (str: string) =>
    str
      .split("")
      .map(
        (letter) => `
    <div class="is-zoomInDown" data-waypoint-target>
      ${letter === " " ? "&nbsp;" : letter}
    </div>
  `
      )
      .join("");
</script>

{#if blogEntry?.seomatic}
  <Seo seo={blogEntry.seomatic} />
{/if}

{#if blogEntry && blogEntry?.__typename === "entryBlogList_Entry"}
  {#if page === 1}
    <Headline
      className={cc.heading}
      text={blogEntry?.customTitle}
      size="7xl"
      family="sans"
      weight="extrabold"
      data-waypoint-target
    />
    <RichText className={cc.text} html={content.about} data-waypoint-target />
  {:else}
    <div class="span-content text-olkch-pink flex font-sans text-7xl font-extrabold" use:useWaypoint data-waypoint>
      {@html splitText(`Page ${page.toString()}`)}
    </div>
  {/if}
  <StackBlog {entries} showPagination={true} totalItems={entryCount} {totalPages} {page} className={cc.list} />
{/if}
