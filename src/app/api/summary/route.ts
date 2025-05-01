import { generateSummary } from "@/lib/chat";

export async function GET() {
  return await generateSummary();
}
