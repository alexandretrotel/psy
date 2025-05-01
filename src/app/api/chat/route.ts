import { canChatToday, saveChat } from "@/lib/chat";
import { streamText } from "ai";
import { model } from "@/lib/ai";

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!(await canChatToday())) {
    // TODO: to change
    return Response.json(
      { error: "Only one chat per day is allowed." },
      { status: 403 },
    );
  }

  const result = streamText({
    model,
    prompt: `You are a compassionate psychologist. Respond to the following message empathetically and provide thoughtful insights:\n${message}`,
    onFinish: async (result) => {
      await saveChat(`${message}\nAI: ${result.text}`);
    },
  });

  return result.toDataStreamResponse();
}
