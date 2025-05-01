import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const ai = createOpenAICompatible({
  name: "lmstudio",
  baseURL: "http://localhost:1234/v1",
});

export const model = ai("meta-llama-3.1-8b-instruct");
