import { graphql, ResultOf, VariablesOf } from "gql.tada";
import { FragmentEntryData, FragmentEntryData2 } from "./fragment";

export const GetHomeQuery = graphql(
  `
    query home($site: [String] = ["davidhellmann_en"], $section: [String]! = ["home"]) {
      entry(site: $site, section: $section) {
        ...test_fragment
        ...test_fragment2
      }
    }
  `,
  [FragmentEntryData, FragmentEntryData2]
);

export type GetHomeResult = ResultOf<typeof GetHomeQuery>;
export type GetHomeVariables = VariablesOf<typeof GetHomeQuery>;
