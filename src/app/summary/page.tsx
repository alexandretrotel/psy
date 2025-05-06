"use client";

import { useState } from "react";
import { useSummary } from "@/hooks/use-summary";
import { useSummaries } from "@/hooks/use-summaries";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SummaryDialog } from "@/components/summary/summary-dialog";
import { SummaryContent } from "@/components/summary/summary-content";
import { SummaryHistory } from "@/components/summary/summary-history";

export default function SummaryPage() {
  const [completion, setCompletion] = useState("");

  const { summaries } = useSummaries();
  const { summary, setSummary, loading } = useSummary();

  const summaryText = completion.trim() || summary;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading summary...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No summary available.</p>
      </div>
    );
  }

  return (
    <>
      <header className="bg-background flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Summary
          </h1>
        </div>
        <SummaryDialog
          setCompletion={setCompletion}
          onSummaryUpdated={setSummary}
        />
      </header>

      <div className="flex-1 space-y-8 px-4 py-6">
        <SummaryContent content={summaryText} />

        <section>
          <h2 className="text-muted-foreground mb-2 text-lg font-semibold">
            Summary History
          </h2>
          <SummaryHistory summaries={summaries} />
        </section>
      </div>
    </>
  );
}
