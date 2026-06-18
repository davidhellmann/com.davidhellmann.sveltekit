import {
  type GetBlogEntriesQueryVariables,
  type GetPhotosEntriesQueryVariables,
  type GetPrerenderDataQueryVariables,
  type GetSeomaticQueryVariables,
  type GetWorkEntriesQueryVariables,
  type Page_BlogSingleFragment,
  type Page_PhotosSingleFragment,
  type Page_WorkSingleFragment
} from "$graphql/graphql";
import { cmsSdk, type PreviewTokens } from "$graphql/graphql-client";

const sdk = (tokens?: PreviewTokens) => cmsSdk(tokens ?? {});

export const getHomeEntries = async (tokens?: PreviewTokens) =>
  (await sdk(tokens).GetHomeEntry({})).entries;

export const getAboutEntries = async (tokens?: PreviewTokens) =>
  (await sdk(tokens).GetAboutEntry({})).entries;

export const getPageByUriEntries = async (uri: string | undefined, tokens?: PreviewTokens) =>
  (await sdk(tokens).GetPageByUri({ uri: [uri] })).entries;

export const getBlogListPageEntries = async (tokens?: PreviewTokens) =>
  (await sdk(tokens).GetBlogListPage({})).entries;

export const getPhotosListPageEntries = async (tokens?: PreviewTokens) =>
  (await sdk(tokens).GetPhotosListPage({})).entries;

export const getWorkListPageEntries = async (tokens?: PreviewTokens) =>
  (await sdk(tokens).GetWorkListPage({})).entries;

const isEntryType = <TEntry extends { __typename: string }>(
  entry: Record<PropertyKey, never> | TEntry,
  typename: TEntry["__typename"]
): entry is TEntry => "__typename" in entry && entry.__typename === typename;

export const getBlogEntriesData = async (
  variables: GetBlogEntriesQueryVariables,
  tokens?: PreviewTokens
) => {
  const data = await sdk(tokens).GetBlogEntries(variables);

  return {
    ...data,
    entries: data.entries.filter((entry) => isEntryType<Page_BlogSingleFragment>(entry, "page_blogSingle_Entry"))
  };
};

export const getPhotosEntriesData = async (
  variables: GetPhotosEntriesQueryVariables,
  tokens?: PreviewTokens
) => {
  const data = await sdk(tokens).GetPhotosEntries(variables);

  return {
    ...data,
    entries: data.entries.filter((entry) => isEntryType<Page_PhotosSingleFragment>(entry, "page_photosSingle_Entry"))
  };
};

export const getWorkEntriesData = async (
  variables: GetWorkEntriesQueryVariables,
  tokens?: PreviewTokens
) => {
  const data = await sdk(tokens).GetWorkEntries(variables);

  return {
    ...data,
    entries: data.entries.filter((entry) => isEntryType<Page_WorkSingleFragment>(entry, "page_workSingle_Entry"))
  };
};

export const getCategoryEntries = async (slug: string | undefined, tokens?: PreviewTokens) =>
  (await sdk(tokens).GetCategoryEntry({ slug: [slug] })).entries;

export const getTopicEntries = async (slug: string | undefined, tokens?: PreviewTokens) =>
  (await sdk(tokens).GetTopicEntry({ slug: [slug] })).entries;

export const getPrerenderData = (
  variables: GetPrerenderDataQueryVariables,
  tokens?: PreviewTokens
) => sdk(tokens).GetPrerenderData(variables);

export const getSeomaticData = (
  variables: GetSeomaticQueryVariables,
  tokens?: PreviewTokens
) => sdk(tokens).GetSeomatic(variables);
