import { generateSchema } from "@gql.tada/cli-utils";
import "dotenv/config";

console.log("Generate schema...");
await generateSchema({
  input: process.env.GQL_API_URL,
  output: "./src/lib/graphql/schema.graphql",
  headers: {
    Authorization: process.env.GQL_API_TOKEN
  },
  tsconfig: "./tsconfig.json"
});
