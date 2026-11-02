import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./drizzle/schema.ts",
  dbCredentials: {
    url: "walmarkt.db",
  },
});