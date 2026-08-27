import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 keeps the connection URL out of schema.prisma. Migrate reads it
 * from here; the client gets it through a driver adapter (see app/lib/db.ts).
 *
 * The URL itself never appears in the repo — it comes from .env, which is
 * gitignored. See .env.example for the shape.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
