import { readFileSync } from "fs";

export async function GET() {
  const dbBuffer = readFileSync("./sqlite.db");
  return new Response(dbBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=psy.db",
    },
  });
}
