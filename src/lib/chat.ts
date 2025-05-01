import { db } from "./db";
import { model } from "./ai";
import { streamText } from "ai";

// Format date as YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split("T")[0];

export async function getOrCreateTodayChat() {
  const today = getTodayDate();
  let chat = await db.chats.where({ date: today }).first();
  if (!chat) {
    chat = { date: today, messages: [], createdAt: new Date() };
    const id = await db.chats.add(chat);
    chat.id = id;
  }
  return chat;
}

export async function addMessageToChat(message: string, aiResponse: string) {
  const chat = await getOrCreateTodayChat();
  const messages = chat.messages;
  messages.push({ user: message, ai: aiResponse });
  await db.chats.update(chat.id!, { messages });
}

export async function getAllChats() {
  return db.chats.toArray();
}

export async function generateSummary() {
  const allChats = await getAllChats();
  if (allChats.length === 0) {
    return Response.json("No chats to summarize.");
  }

  const chatContents = allChats.map((chat) => ({
    date: chat.date,
    messages: chat.messages,
  }));

  const result = streamText({
    model,
    prompt: `Summarize the following chat history in a concise and insightful way, capturing key themes and emotions:\n${JSON.stringify(
      chatContents,
      null,
      2,
    )}`,
    onFinish: async (result) => {
      await db.summaries.add({
        summary: result.text,
        generatedAt: new Date(),
      });
    },
  });

  return result.toDataStreamResponse();
}

export async function getLatestSummary() {
  const summary = await db.summaries.orderBy("generatedAt").last();
  return summary ? summary.summary : null;
}
