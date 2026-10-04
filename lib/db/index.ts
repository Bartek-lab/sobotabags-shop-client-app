import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Port 6543 is Supabase's transaction-mode pgbouncer pooler, which doesn't
// support prepared statements — must be disabled or queries fail at runtime.
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, { schema });
