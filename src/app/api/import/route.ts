import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const text = await file.text();
  const data = JSON.parse(text);
  const { chats, summaries } = data;

  await db.chats.clear();
  await db.summaries.clear();
  await db.chats.bulkAdd(chats);
  await db.summaries.bulkAdd(summaries);

  return Response.json({ success: true });
}
