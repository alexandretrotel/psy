import { streamText } from "ai";
import { model } from "@/lib/ai";
import { Chat } from "@/lib/db";

export async function POST(request: Request) {
  const { chatHistory, prompt } = await request.json();
  if (!chatHistory || chatHistory.length === 0) {
    return Response.json("No chats to summarize.");
  }

  const chatContents = chatHistory.map((chat: Chat) => ({
    date: chat.date,
    messages: chat.messages,
  }));

  let aiPrompt: string | null = null;
  if (prompt) {
    aiPrompt = `From the following chat history, summarize the user's state of mind, focusing on key emotional themes, recurring concerns, and insights. Keep the summary brief and empathetic:\n${JSON.stringify(
      chatContents,
      null,
      2,
    )}`;
  } else {
    aiPrompt = `From the following chat history, summarize the user's state of mind, focusing on key emotional themes, recurring concerns, and insights. The summary should focus on what the user has asked:\n${prompt}\nAnd the chat history:\n${JSON.stringify(
      chatContents,
      null,
      2,
    )}`;
  }

  const result = streamText({
    model,
    prompt: aiPrompt,
    temperature: 0.8, // Slightly higher for nuanced insights
    maxTokens: 150, // Short, focused summaries
    topP: 0.85, // Slightly more focused than chat route
  });

  return result.toDataStreamResponse();
}
