/**
 * Prisma client for scripts.
 *
 * Prisma 7 requires a driver adapter and reads the connection string at
 * runtime rather than from schema.prisma. The URL comes from .env, which is
 * gitignored — it is never hard-coded and never logged.
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

export function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
