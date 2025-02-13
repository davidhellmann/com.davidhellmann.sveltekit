import { graphql } from "gql.tada";

export const FragmentEntryData = graphql(`
  fragment test_fragment on EntryInterface {
    id
    uid
    title
    slug
    uri
    url
  }
`);

export const FragmentEntryData2 = graphql(`
  fragment test_fragment2 on EntryInterface {
    canonicalId
    language
    sectionHandle
    typeHandle
    siteHandle
    siteId
  }
`);
