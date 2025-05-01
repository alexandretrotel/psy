"use client";

import { ChatView } from "@/components/chat-view";
import { ExportImportControls } from "@/components/export-import-controls";
import { useChats } from "@/hooks/use-chats";
import { useSummary } from "@/hooks/use-summary";
import { motion } from "motion/react";

export default function Home() {
  const { fetchChats } = useChats();
  const { fetchSummary } = useSummary();

  const fetchData = async () => {
    await fetchChats();
    await fetchSummary();
  };

  return (
    <>
      <motion.header
        className="flex items-center justify-between border-b p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-foreground text-xl font-bold">Psychologist</h1>
        <ExportImportControls onDataImported={fetchData} />
      </motion.header>

      <div className="flex-1 p-4">
        <ChatView onChatsUpdated={fetchData} />
      </div>
    </>
  );
}
