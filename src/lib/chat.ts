import { Chat, db, Summary } from "./db";

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
  return chat;
}

export async function getAllChats() {
  return db.chats.toArray();
}

export async function saveSummary(summary: string) {
  await db.summaries.add({
    summary,
    generatedAt: new Date(),
  });
}

export async function getLatestSummary() {
  const summary = await db.summaries.orderBy("generatedAt").last();
  return summary ? summary.summary : null;
}

export async function exportData() {
  const chats = await db.chats.toArray();
  const summaries = await db.summaries.toArray();
  return { chats, summaries };
}

export async function importData(data: {
  chats: Chat[];
  summaries: Summary[];
}) {
  await db.chats.clear();
  await db.summaries.clear();
  await db.chats.bulkAdd(data.chats);
  await db.summaries.bulkAdd(data.summaries);
}
