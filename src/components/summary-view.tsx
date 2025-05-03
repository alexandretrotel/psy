"use client";

import { Button } from "@/components/ui/button";
import { saveSummary } from "@/lib/chat";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import { useChats } from "@/hooks/use-chats";
import { Markdown } from "./wrappers/markdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useSummaries } from "@/hooks/use-summaries";
import { format } from "date-fns";

interface SummaryViewProps {
  oldSummary: string;
  onSummaryUpdated: (newSummary: string) => void;
}

export function SummaryView({
  oldSummary,
  onSummaryUpdated,
}: SummaryViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { chats } = useChats();
  const { summaries, fetchSummaries } = useSummaries();

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/summary",
    body: { chatHistory: chats, prompt },
    onFinish: async (prompt, completion) => {
      const finalPrompt = prompt.trim() !== "" ? prompt : undefined;
      await saveSummary(completion, finalPrompt);
      await fetchSummaries();

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

        <div className="flex items-center gap-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={isLoading}>
                {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground">
                  Enter a question related to the summary, or leave it blank for
                  a general summary.
                </p>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full resize-none rounded-md border p-2"
                  placeholder="What is the summary of this chat?"
                />
                <Button
                  size="sm"
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setDialogOpen(false);
                      await complete(prompt);
                      setPrompt("");
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "An error occurred",
                      );
                    }
                  }}
                >
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 space-y-6 px-4 pb-4">
        <div>
          {!completion && oldSummary && (
            <div className="text-foreground mt-4">
              <Markdown text={oldSummary} />
            </div>
          )}
          {completion.trim() !== "" && (
            <div className="text-foreground mt-4">
              <Markdown text={completion} />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-muted-foreground mb-2 text-lg font-semibold">
            Summary History
          </h2>
          <Accordion type="multiple" className="bg-muted/50 rounded-md border">
            {summaries.length === 0 ? (
              <div className="text-muted-foreground p-4 text-sm">
                No previous summaries.
              </div>
            ) : (
              summaries.map((summary, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="rounded-t-md px-4 py-2">
                    {summary.prompt ? `${summary.prompt}` : "General"}{" "}
                    <span className="text-muted-foreground ml-auto text-xs">
                      {format(new Date(summary.generatedAt), "PPPp")}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <Markdown text={summary.summary} />
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>
        </div>
      </div>
    </>
  );
}
