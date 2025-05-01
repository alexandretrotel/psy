"use client";

import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat.store";
import { getAllChats, saveSummary } from "@/lib/chat";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

interface SummaryViewProps {
  summary: string;
  onSummaryUpdated: (newSummary: string) => void;
}

export function SummaryView({ summary, onSummaryUpdated }: SummaryViewProps) {
  const { loading, setLoading } = useChatStore();

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const allChats = await getAllChats();
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory: allChats }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      let summaryText = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          summaryText += decoder.decode(value);
        }
      }

      await saveSummary(summaryText);
      onSummaryUpdated(summaryText);

      toast.success("Summary generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
    setLoading(false);
  };

  return (
    <>
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-foreground text-xl font-bold">Summary</h1>
      </header>

      <div className="flex-1 px-4 pb-4">
        <div>
          <Button onClick={handleGenerateSummary} disabled={loading}>
            {loading && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate Summary"}
          </Button>

          <p className="text-muted-foreground mt-4">{summary}</p>
        </div>
      </div>
    </>
  );
}
