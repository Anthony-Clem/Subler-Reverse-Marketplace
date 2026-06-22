import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing");
}

const isLocal =
  process.env.DATABASE_URL.includes("localhost") ||
  process.env.DATABASE_URL.includes("127.0.0.1") ||
  process.env.DATABASE_URL.includes("postgres:");

export const db = (() => {
  if (isLocal) {
    // Local development: use standard postgres-js driver
    const client = postgres(process.env.DATABASE_URL!);
    return drizzlePostgres(client, { schema });
  } else {
    // Production (Neon serverless): use optimized HTTP driver
    const client = neon(process.env.DATABASE_URL!);
    return drizzleNeon(client, { schema });
  }
})();
export type DbType = typeof db;
