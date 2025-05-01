"use client";

import { SummaryView } from "@/components/summary-view";
import { useSummary } from "@/hooks/use-summary";

export default function SummaryPage() {
  const { summary, setSummary, loading } = useSummary();

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

  return <SummaryView summary={summary} onSummaryUpdated={setSummary} />;
}
