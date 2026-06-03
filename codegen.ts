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
      /**
       * Note: the `typescript` base-types plugin is intentionally omitted.
       * Since `typescript-operations` v6 it is self-contained — it emits the
       * input/enum types used by operations (plus the `Exact`/`Incremental`
       * helpers) on its own. Running the `typescript` plugin in the same file
       * would re-declare every input type and crash the build with
       * "Identifier has already been declared".
       */
      plugins: ["typescript-operations", "typescript-graphql-request"],
      config: {
        skipTypename: false,
        maybeValue: "T",
        useTypeImports: true,
        dedupeFragments: true
      }
    }
  }
};

export default config;
