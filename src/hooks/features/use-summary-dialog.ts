import { saveSummary } from "@/lib/chat";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useChats } from "@/hooks/use-chats";
import { useSummaries } from "@/hooks/use-summaries";
import { useCompletion } from "@ai-sdk/react";
export function useSummaryDialog(
  setCompletion: (completion: string) => void,
  onSummaryUpdated: (summary: string) => void,
) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { chats } = useChats();
  const { fetchSummaries } = useSummaries();

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/summary",
    body: { chatHistory: chats, prompt },
    onFinish: async (_, result) => {
      try {
        const finalPrompt = prompt.trim() || undefined;
        await saveSummary(result, finalPrompt);
        await fetchSummaries();
        onSummaryUpdated(result);
        toast.success("Summary generated!");
      } catch {
        toast.error("Failed to save summary.");
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    },
  });

  useEffect(() => {
    setCompletion(completion ?? "");
  }, [completion, setCompletion]);

  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(e.target.value);
    },
    [],
  );

  const handleGenerate = async () => {
    try {
      setDialogOpen(false);
      await complete(prompt);
      setPrompt("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return {
    dialogOpen,
    setDialogOpen,
    prompt,
    isLoading,
    handlePromptChange,
    handleGenerate,
  };
}
