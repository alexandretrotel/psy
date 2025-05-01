import { streamText } from "ai";
import { model } from "@/lib/ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model,
    system: `You are a compassionate psychologist. Respond to the following message empathetically.`,
    messages,
  });

  return result.toDataStreamResponse();
}
