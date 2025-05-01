import { getOrCreateTodayChat, addMessageToChat } from "@/lib/chat";
import { streamText } from "ai";
import { model } from "@/lib/ai";

export async function POST(request: Request) {
  const { message } = await request.json();
  await getOrCreateTodayChat();

  const result = streamText({
    model,
    prompt: `You are a compassionate psychologist. Respond to the following message empathetically and provide thoughtful insights:\n${message}`,
    onFinish: async (result) => {
      await addMessageToChat(message, result.text);
    },
  });

  return result.toDataStreamResponse();
}
