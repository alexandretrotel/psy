import { streamText } from "ai";
import { model } from "@/lib/ai";
import { system } from "@/data/prompts";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model,
    system,
    messages,
    temperature: 0.7, // Balanced for empathetic, focused responses
    maxTokens: 200, // Concise yet meaningful replies
    topP: 0.9, // Moderate diversity in word choice
  });

  return result.toDataStreamResponse();
}
