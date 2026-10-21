import "dotenv/config";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: pathToFileURL(join(process.cwd(), "data", "reds.db")).href,
  },
});
