import {
  type GetBlogEntriesQueryVariables,
  type GetPhotosEntriesQueryVariables,
  type GetSeomaticQueryVariables,
  type GetWorkEntriesQueryVariables
} from "$graphql/graphql";
import { cmsSdk, type PreviewTokens } from "$graphql/graphql-client";
import { getEntriesOfType, getEntryOfType } from "$graphql/entry-type";

const sdk = (tokens?: PreviewTokens) => cmsSdk(tokens ?? {});

export const getHome = async (tokens?: PreviewTokens) =>
  getEntryOfType((await sdk(tokens).GetHomeEntry({})).entries, "page_home_Entry");

export const getAbout = async (tokens?: PreviewTokens) =>
  getEntryOfType((await sdk(tokens).GetAboutEntry({})).entries, "page_about_Entry");

export const getPageByUri = async (uri: string, tokens?: PreviewTokens) =>
  getEntryOfType((await sdk(tokens).GetPageByUri({ uri: [uri] })).entries, "page_contentBuilder_Entry");

export const getBlogList = async (tokens?: PreviewTokens) =>
  getEntryOfType((await sdk(tokens).GetBlogListPage({})).entries, "page_blogList_Entry");

export const getPhotosList = async (tokens?: PreviewTokens) =>
  getEntryOfType((await sdk(tokens).GetPhotosListPage({})).entries, "page_photosList_Entry");

export const getWorkList = async (tokens?: PreviewTokens) =>
  getEntryOfType((await sdk(tokens).GetWorkListPage({})).entries, "page_workList_Entry");

export const getBlogPosts = async (variables: GetBlogEntriesQueryVariables, tokens?: PreviewTokens) => {
  const data = await sdk(tokens).GetBlogEntries(variables);

  return {
    ...data,
    entries: getEntriesOfType(data.entries, "page_blogSingle_Entry")
  };
};

export const getPhotoGalleries = async (variables: GetPhotosEntriesQueryVariables, tokens?: PreviewTokens) => {
  const data = await sdk(tokens).GetPhotosEntries(variables);

  return {
    ...data,
    entries: getEntriesOfType(data.entries, "page_photosSingle_Entry")
  };
};

export const getWorkProjects = async (variables: GetWorkEntriesQueryVariables, tokens?: PreviewTokens) => {
  const data = await sdk(tokens).GetWorkEntries(variables);

  return {
    ...data,
    entries: getEntriesOfType(data.entries, "page_workSingle_Entry")
  };
};

export const getBlogCategory = async (slug: string, tokens?: PreviewTokens) =>
  getEntryOfType((await sdk(tokens).GetCategoryEntry({ slug: [slug] })).entries, "page_category_Entry");

export const getBlogTopic = async (slug: string, tokens?: PreviewTokens) =>
  getEntryOfType((await sdk(tokens).GetTopicEntry({ slug: [slug] })).entries, "page_topic_Entry");

export const getSeomaticData = (variables: GetSeomaticQueryVariables, tokens?: PreviewTokens) =>
  sdk(tokens).GetSeomatic(variables);
