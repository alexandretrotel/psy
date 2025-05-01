"use client";

import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatView } from "@/components/chat-view";
import { SummaryView } from "@/components/summary-view";
import { ExportImportControls } from "@/components/export-import-controls";
import { Chat } from "@/lib/db";
import { getAllChats, getLatestSummary } from "@/lib/chat";
import { useChatStore } from "@/stores/chat.store";
import { motion } from "motion/react";

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [summary, setSummary] = useState("");
  const { selectedChatId } = useChatStore();

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  const fetchData = async () => {
    const allChats = await getAllChats();
    setChats(allChats);
    setSummary((await getLatestSummary()) || "No summary yet.");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <motion.header
        className="border-b p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Psychologist</h1>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar chats={chats} />

        <main className="flex flex-1 flex-col gap-4 p-4">
          <ChatView chat={selectedChat} onChatsUpdated={fetchData} />
          <SummaryView summary={summary} onSummaryUpdated={setSummary} />
          <ExportImportControls onDataImported={fetchData} />
        </main>
      </div>
    </div>
  );
}
