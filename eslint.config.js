import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.svelte"],
    rules: {
      indent: ["error", 2]
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    ignores: ["build/", ".svelte-kit/", "dist/", "src/lib/graphql/", "src/lib/styles/tailwind/"]
  },
  {
    rules: {
      indent: ["error", 2],
      "max-len": [
        "warn",
        {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true
        }
      ],

      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"]
    }
  }
);
