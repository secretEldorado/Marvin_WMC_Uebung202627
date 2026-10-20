// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./schema.ts",
  dbCredentials: {
    url: "./musik.db"
  },
  migrations: {
    table: 'my_migration_table', 
  },
});
