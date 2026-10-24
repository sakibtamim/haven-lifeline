import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/haven";

// Disable prefetch for serverless / edge compatibility
export const queryClient = postgres(connectionString, { max: 10, idle_timeout: 20 });
export const db = drizzle(queryClient, { schema });
