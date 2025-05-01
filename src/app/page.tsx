"use client";

import { ChatView } from "@/components/chat-view";
import { ExportImportControls } from "@/components/export-import-controls";
import { useChats } from "@/hooks/use-chats";
import { useSummary } from "@/hooks/use-summary";

export default function Home() {
  const { fetchChats } = useChats();
  const { fetchSummary } = useSummary();

  const fetchData = async () => {
    await fetchChats();
    await fetchSummary();
  };

  return (
    <>
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-foreground text-xl font-bold">Psychologist</h1>
        <ExportImportControls onDataImported={fetchData} />
      </header>

      <div className="flex-1 px-4 pb-4">
        <ChatView onChatsUpdated={fetchData} />
      </div>
    </>
  );
}
