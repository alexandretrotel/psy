import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { createClient } from "@libsql/client";

const client = createClient({ url: "file:psy.db" });
export const db = drizzle({ client, schema });
