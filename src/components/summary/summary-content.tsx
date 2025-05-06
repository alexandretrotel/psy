"use client";

import { Markdown } from "@/components/wrappers/markdown";

interface SummaryContentProps {
  content: string | null;
}

export function SummaryContent({ content }: SummaryContentProps) {
  if (!content || !content.trim()) return null;

  return (
    <div className="prose prose-sm bg-muted/50 dark:prose-invert max-w-none rounded-md border p-4 py-2">
      <Markdown text={content} />
    </div>
  );
}
