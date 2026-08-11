import type { Asset_CustomFieldsFragment, Asset_DataFragment, Asset_TransformsFragment } from "$graphql/graphql";

export type {
  Entry_DataFragment as ContentLink,
  Entry_DatesFragment as ContentDates,
  Entry_SeoFragment as ContentSeo,
  Hyper_DataFragment as Hyperlink,
  Matrix_ContentBuilderFragment as ContentBlock,
  Matrix_CurriculumVitaeFragment as CurriculumVitaeEntry,
  Page_AboutFragment as AboutEntry,
  Page_BlogListFragment as BlogListEntry,
  Page_BlogSingleFragment as BlogEntry,
  Page_CategoryFragment as BlogCategoryEntry,
  Page_ContentBuilderFragment as ContentPageEntry,
  Page_HomeFragment as HomeEntry,
  Page_PhotosListFragment as PhotosListEntry,
  Page_PhotosSingleFragment as PhotosEntry,
  Page_TopicFragment as BlogTopicEntry,
  Page_WorkListFragment as WorkListEntry,
  Page_WorkSingleFragment as WorkEntry
} from "$graphql/graphql";

export type ImageAsset = Asset_DataFragment &
  Partial<Asset_TransformsFragment> &
  Partial<Asset_CustomFieldsFragment> & {
    __typename?: string;
  };
