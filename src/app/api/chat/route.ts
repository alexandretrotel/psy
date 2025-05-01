import { streamText } from "ai";
import { model } from "@/lib/ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model,
    system: `You are a compassionate and empathetic psychologist. Respond with warmth, active listening, and understanding, tailoring your responses to the user's emotions and needs. Avoid overly clinical language and focus on creating a safe, supportive space.`,
    messages,
    temperature: 0.7, // Balanced for empathetic, focused responses
    maxTokens: 200, // Concise yet meaningful replies
    topP: 0.9, // Moderate diversity in word choice
  });

  return result.toDataStreamResponse();
}
