import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

// Use database connection string from environment variables
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/tiktokshop";

// Create connection pool
export const pool = new Pool({ 
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
});

// Initialize drizzle with schema
export const db = drizzle(pool, { schema });

// Connection health check
export async function checkConnection() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
