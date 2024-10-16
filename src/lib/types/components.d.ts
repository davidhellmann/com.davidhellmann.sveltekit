import { Asset_DataFragment, Asset_TransformsFragment, Asset_CustomFieldsFragment } from "$graphql/graphql";

// Image Types
export type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type Asset = Asset_DataFragment & Asset_TransformsFragment & Asset_CustomFieldsFragment;
export type ImageRatio = "aspect-auto" | "aspect-landscape" | "aspect-portrait" | "aspect-square";
