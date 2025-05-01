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
    prompt: `Summarize the following chat history in a concise and insightful way, capturing key themes and emotions:\n${JSON.stringify(
      chatContents,
      null,
      2,
    )}`,
  });

  return result.toDataStreamResponse();
}
