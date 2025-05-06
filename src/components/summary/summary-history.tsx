"use client";

import { format } from "date-fns";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Markdown } from "@/components/wrappers/markdown";
import { Summary } from "@/lib/db";

interface SummaryHistoryProps {
  summaries: Summary[];
}

export function SummaryHistory({ summaries }: SummaryHistoryProps) {
  const sortedSummaries = [...summaries].sort(
    (a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
  );

  if (sortedSummaries.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No previous summaries found.
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="bg-muted/40 rounded-md border">
      {sortedSummaries.map((summary, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground rounded-t-md px-4 py-2 transition">
            <span>{summary.prompt || "General"}</span>
            <span className="text-muted-foreground ml-auto text-xs">
              {format(new Date(summary.generatedAt), "PPPp")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Markdown text={summary.summary} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
