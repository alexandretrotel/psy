import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import * as schema from "./schema";

const client = new SQL("./sqlite.db");
export const db = drizzle({ client, schema });
