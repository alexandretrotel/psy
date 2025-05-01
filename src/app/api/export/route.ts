import { db } from "@/lib/db";

export async function GET() {
  const chats = await db.chats.toArray();
  const summaries = await db.summaries.toArray();
  const data = { chats, summaries };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  return new Response(blob, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=psychologue.json",
    },
  });
}
