"use client";

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
import { useSummaryDialog } from "@/hooks/features/use-summary-dialog";

interface SummaryDialogProps {
  setCompletion: (completion: string) => void;
  onSummaryUpdated: (newSummary: string) => void;
}

export function SummaryDialog({
  setCompletion,
  onSummaryUpdated,
}: SummaryDialogProps) {
  const {
    dialogOpen,
    setDialogOpen,
    prompt,
    isLoading,
    handlePromptChange,
    handleGenerate,
  } = useSummaryDialog(setCompletion, onSummaryUpdated);

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
