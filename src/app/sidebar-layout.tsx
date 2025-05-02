"use client";

import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useChats } from "@/hooks/use-chats";
import { getOrCreateTodayChat } from "@/lib/chat";
import { useChatStore } from "@/stores/chat.store";
import { useCallback, useEffect } from "react";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chats, setChats } = useChats();
  const { setSelectedChatId } = useChatStore();

  const createTodayChat = useCallback(async () => {
    const chat = await getOrCreateTodayChat();
    setChats([chat]);
    setSelectedChatId(chat.id!);
  }, [setChats, setSelectedChatId]);

  useEffect(() => {
    if (chats.length === 0) {
      createTodayChat();
    }
  }, [chats.length, createTodayChat]);

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-1 flex-col">
        <div className="flex flex-1">
          <ChatSidebar chats={chats} />

          <main className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
