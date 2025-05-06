"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useCompletion } from "@ai-sdk/react";
import { saveSummary } from "@/lib/chat";
import { useChats } from "@/hooks/use-chats";
import { useSummaries } from "@/hooks/use-summaries";

interface SummaryDialogProps {
  setCompletion: (completion: string) => void;
  onSummaryUpdated: (newSummary: string) => void;
}

export function SummaryDialog({
  setCompletion,
  onSummaryUpdated,
}: SummaryDialogProps) {
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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              <span className="ml-2">Generating...</span>
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate a New Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Optionally provide a prompt to tailor the summary.
          </p>
          <Textarea
            value={prompt}
            onChange={handlePromptChange}
            className="min-h-[100px]"
            placeholder="What is the summary of this chat?"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button size="sm" onClick={handleGenerate} disabled={isLoading}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
