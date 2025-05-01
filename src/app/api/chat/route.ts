import {
  getOrCreateTodayChat,
  addMessageToChat,
  getAllChats,
} from "@/lib/chat";
import { streamText } from "ai";
import { model } from "@/lib/ai";

export async function POST(request: Request) {
  const { message } = await request.json();
  await getOrCreateTodayChat();

  const allChats = await getAllChats();
  const chatHistory = allChats
    .flatMap((chat) =>
      chat.messages.map((msg) => `User: ${msg.user}\nAI: ${msg.ai}`),
    )
    .join("\n");

  const result = streamText({
    model,
    prompt: `You are a compassionate psychologist with access to the following chat history:\n${chatHistory}\n\nRespond to the following message empathetically, using the history for context:\n${message}`,
    onFinish: async (result) => {
      await addMessageToChat(message, result.text);
    },
  });

  return result.toDataStreamResponse();
}
