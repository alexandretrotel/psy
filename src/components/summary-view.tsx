"use client";

import { Button } from "@/components/ui/button";
import { saveSummary } from "@/lib/chat";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import { useChats } from "@/hooks/use-chats";

interface SummaryViewProps {
  oldSummary: string;
  onSummaryUpdated: (newSummary: string) => void;
}

export function SummaryView({
  oldSummary,
  onSummaryUpdated,
}: SummaryViewProps) {
  const { chats } = useChats();

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/summary",
    body: { chatHistory: chats },
    onFinish: async (prompt, completion) => {
      await saveSummary(completion);
      onSummaryUpdated(completion);
      toast.success("Summary generated!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    },
  });

  return (
    <>
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-foreground text-xl font-bold">Summary</h1>
      </header>

      <div className="flex-1 px-4 pb-4">
        <div>
          <Button
            onClick={async () => {
              await complete("");
            }}
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {isLoading ? "Generating..." : "Generate Summary"}
          </Button>

          {!completion && oldSummary && (
            <p className="text-muted-foreground mt-4">{oldSummary}</p>
          )}
          {completion.trim() !== "" && (
            <p className="text-muted-foreground mt-4">{completion}</p>
          )}
        </div>
      </div>
    </>
  );
}
