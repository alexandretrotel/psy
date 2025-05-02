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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

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

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/summary",
    body: { chatHistory: chats, prompt },
    onFinish: async (prompt, completion) => {
      if (prompt.trim() === "") {
        await saveSummary(completion);
      } else {
        // TODO: Handle the case when a question is asked
      }

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
          <Button
            size="sm"
            onClick={async () => {
              try {
                await complete("");
              } catch (error) {
                toast.error(
                  error instanceof Error ? error.message : "An error occurred",
                );
              }
            }}
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {isLoading ? "Generating..." : "Generate"}
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={isLoading}>
                Ask a question
              </Button>
            </DialogTrigger>

            <DialogContent>
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground">
                  Ask a question about the summary. The psy will generate a
                  response based on the summary.
                </p>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full resize-none rounded-md border p-2"
                  placeholder="Type your question here..."
                />
                <Button
                  size="sm"
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setDialogOpen(false);
                      await complete("");
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

      <div className="flex-1 px-4 pb-4">
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
      </div>
    </>
  );
}
