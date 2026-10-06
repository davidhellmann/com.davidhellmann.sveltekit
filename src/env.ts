import { defineEnvVars } from "@sveltejs/kit/env";

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
  GQL_API_URL: { schema: (input) => input ?? "" },
  GQL_API_TOKEN: { schema: (input) => input ?? "" }
});
