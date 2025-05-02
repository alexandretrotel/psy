"use client";

import { ChatView } from "@/components/chat-view";
import { Controls } from "@/components/controls";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
    <div className="transition-width relative h-full w-full flex-1 overflow-auto">
      <header className="sticky top-0 flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        <Controls onDataImported={fetchData} />
      </header>

      <div className="flex-1 px-4 pb-4">
        <ChatView onChatsUpdated={fetchData} />
      </div>
    </div>
  );
}
