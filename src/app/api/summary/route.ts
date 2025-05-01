import { streamText } from "ai";
import { model } from "@/lib/ai";
import { Chat } from "@/lib/db";

export async function POST(request: Request) {
  const { chatHistory } = await request.json();
  if (!chatHistory || chatHistory.length === 0) {
    return Response.json("No chats to summarize.");
  }

  const chatContents = chatHistory.map((chat: Chat) => ({
    date: chat.date,
    messages: chat.messages,
  }));

  const result = streamText({
    model,
    prompt: `From the following chat history summarize concisely the state of mind of the user, highlighting key emotional themes, recurring concerns, and insights. Keep the summary brief and empathetic:\n${JSON.stringify(
      chatContents,
      null,
      2,
    )}`,
    temperature: 0.8, // Slightly higher for nuanced insights
    maxTokens: 150, // Short, focused summaries
    topP: 0.85, // Slightly more focused than chat route
  });

  return result.toDataStreamResponse();
}
