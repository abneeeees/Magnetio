import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = (globalThis as any).process?.env?.DATABASE_URL;

export default defineConfig({
  datasource: {
    url: databaseUrl!,
  },
});
