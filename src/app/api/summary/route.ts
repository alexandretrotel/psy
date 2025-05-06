import { streamText } from "ai";
import { model } from "@/lib/ai";
import { Chat } from "@/lib/db";
import { system } from "@/data/prompts";

export async function POST(request: Request) {
  const { chatHistory, prompt } = await request.json();

  if (!chatHistory || chatHistory.length === 0) {
    return Response.json("No chats to summarize.");
  }

  const chatContents = chatHistory.map((chat: Chat) => ({
    date: chat.date,
    messages: chat.messages,
  }));

  let userPrompt: string | null = null;
  if (prompt) {
    userPrompt = `À partir de l'historique des discussions ci-dessous, résume l'état émotionnel de l'utilisateur. Identifie les thèmes émotionnels clés, les préoccupations récurrentes et propose des suggestions bienveillantes (par exemple, "vous pourriez vous sentir..."). Fais référence à des éléments précis des discussions pour ancrer tes observations :\n${JSON.stringify(chatContents, null, 2)}`;
  } else {
    userPrompt = `À partir de l'historique des discussions ci-dessous, réponds à la demande de l'utilisateur : "${prompt}". Fournis un résumé ou des insights en lien avec sa demande, en identifiant les thèmes émotionnels et préoccupations pertinents. Faites référence à des éléments précis des discussions pour ancrer tes observations :\n${JSON.stringify(chatContents, null, 2)}`;
  }

  const result = streamText({
    model,
    system,
    prompt: userPrompt,
    temperature: 0.8, // Slightly higher for nuanced insights
    maxTokens: 150, // Short, focused summaries
    topP: 0.85, // Slightly more focused than chat route
  });

  return result.toDataStreamResponse();
}
