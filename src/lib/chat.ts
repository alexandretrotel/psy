import { db } from "@/db";
import { chats, summaries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ai } from "./ai";
import { streamText } from "ai";

// Format date as YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split("T")[0];

export async function canChatToday() {
  const today = getTodayDate();
  const existingChat = await db
    .select()
    .from(chats)
    .where(eq(chats.date, today))
    .get();

  return !existingChat;
}

export async function saveChat(content: string) {
  const today = getTodayDate();
  await db.insert(chats).values({
    date: today,
    content,
    createdAt: new Date(),
  });
}

export async function getAllChats() {
  return db.select().from(chats);
}

export async function generateSummary() {
  const allChats = await getAllChats();
  if (allChats.length === 0) return Response.json("No chats to summarize.");

  const chatContents = allChats.map((chat) => ({
    date: chat.date,
    content: chat.content,
  }));

  const result = streamText({
    model: ai("chat"),
    prompt: `Summarize the following chat history in a concise and insightful way, capturing key themes and emotions:\n${JSON.stringify(
      chatContents,
      null,
      2,
    )}`,
    onFinish: async (result) => {
      await db.insert(summaries).values({
        summary: result.text,
        generatedAt: new Date(),
      });
    },
  });

  return result.toDataStreamResponse();
}

export async function getLatestSummary() {
  const summary = await db
    .select()
    .from(summaries)
    .orderBy(desc(summaries.generatedAt))
    .get();
  return summary ? summary.summary : null;
}
