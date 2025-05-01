import { db } from "@/db";
import { chats, summaries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { model } from "./ai";
import { streamText } from "ai";

// Format date as YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split("T")[0];

export async function getOrCreateTodayChat() {
  const today = getTodayDate();

  let chat = await db.select().from(chats).where(eq(chats.date, today)).get();
  if (!chat) {
    await db.insert(chats).values({
      date: today,
      messages: JSON.stringify([]),
      createdAt: new Date(),
    });

    chat = await db.select().from(chats).where(eq(chats.date, today)).get();
  }

  return chat;
}

export async function addMessageToChat(message: string, aiResponse: string) {
  const today = getTodayDate();
  const chat = await getOrCreateTodayChat();
  const messages = JSON.parse(chat?.messages || "[]") as Array<{
    user: string;
    ai: string;
  }>;

  messages.push({ user: message, ai: aiResponse });

  await db
    .update(chats)
    .set({ messages: JSON.stringify(messages) })
    .where(eq(chats.date, today));
}

export async function getAllChats() {
  return db.select().from(chats);
}

export async function generateSummary() {
  const allChats = await getAllChats();
  if (allChats.length === 0) {
    return Response.json("No chats to summarize.");
  }

  const chatContents = allChats.map((chat) => ({
    date: chat.date,
    messages: JSON.parse(chat.messages as string),
  }));

  const result = streamText({
    model,
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
