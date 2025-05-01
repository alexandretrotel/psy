import { streamText } from "ai";
import { model } from "@/lib/ai";
import { Chat, Message } from "@/lib/db";

export async function POST(request: Request) {
  const { message, chatHistory } = await request.json();
  const historyText = chatHistory
    .flatMap((chat: Chat) =>
      chat.messages.map((msg: Message) => `User: ${msg.user}\nAI: ${msg.ai}`),
    )
    .join("\n");

  const result = streamText({
    model,
    prompt: `You are a compassionate psychologist with access to the following chat history:\n${historyText}\n\nRespond to the following message empathetically, using the history for context:\n${message}`,
  });

  return result.toDataStreamResponse();
}
