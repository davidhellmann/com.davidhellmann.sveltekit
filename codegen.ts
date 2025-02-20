import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  hooks: {
    afterOneFileWrite: ["prettier --write"]
  },
  schema: [
    {
      [`${import.meta.env.GQL_API_URL}`]: {
        headers: {
          Authorization: `Bearer ${import.meta.env.GQL_API_TOKEN}`
        }
      }
    }
  ],
  watch: true,
  documents: ["./src/lib/graphql/queries/**/*.graphql"],
  generates: {
    "./src/lib/graphql/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
      config: {
        /**
         * Fix issue about multiple same named fragments
         * @ee https://github.com/dotansimha/graphql-code-generator/issues/3063
         */
        withHooks: true,
        skipTypename: false,
        onlyOperationTypes: true,
        maybeValue: "T",
        useTypeImports: true,
        dedupeFragments: true
      }
    }
  }
};

export default config;
