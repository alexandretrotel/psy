"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat.store";
import { getAllChats, saveSummary } from "@/lib/chat";
import { motion } from "motion/react";
import { toast } from "sonner";

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
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Summary of All Chats</CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button onClick={handleGenerateSummary} disabled={loading}>
            {loading ? "Generating..." : "Generate Summary"}
          </Button>

          <p className="text-muted-foreground mt-4">{summary}</p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
