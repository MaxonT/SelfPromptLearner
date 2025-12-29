import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import { log } from "./index";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimize connection pool for production
// Render free tier typically allows 5-10 connections
const poolConfig: pg.PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || "10", 10), // Maximum number of clients in the pool
  min: parseInt(process.env.DB_POOL_MIN || "2", 10), // Minimum number of clients in the pool
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || "30000", 10), // Close idle clients after 30 seconds
  connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT || "10000", 10), // Return an error after 10 seconds if connection could not be established
};

export const pool = new Pool(poolConfig);

// Handle pool errors
pool.on("error", (err) => {
  log(`Unexpected error on idle client: ${err?.message || String(err)}`, "db-pool");
});

export const db = drizzle(pool, { schema });
