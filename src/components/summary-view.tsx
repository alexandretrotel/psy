"use client";

import { Button } from "@/components/ui/button";
import { saveSummary } from "@/lib/chat";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import { useChats } from "@/hooks/use-chats";
import { Markdown } from "./wrappers/markdown";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-foreground text-xl font-bold">Summary</h1>
        </div>

        <Button
          size="sm"
          onClick={async () => {
            await complete("");
          }}
          disabled={isLoading}
        >
          {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </header>

      <div className="flex-1 px-4 pb-4">
        <div>
          {!completion && oldSummary && (
            <div className="text-muted-foreground mt-4">
              <Markdown text={oldSummary} />
            </div>
          )}
          {completion.trim() !== "" && (
            <div className="text-muted-foreground mt-4">
              <Markdown text={completion} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
