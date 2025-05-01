"use client";

import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useChats } from "@/hooks/use-chats";
import { getOrCreateTodayChat } from "@/lib/chat";
import { useCallback, useEffect } from "react";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chats, setChats } = useChats();

  const createTodayChat = useCallback(async () => {
    const chat = await getOrCreateTodayChat();
    setChats([chat]);
  }, [setChats]);

  useEffect(() => {
    if (chats.length === 0) {
      createTodayChat();
    }
  }, [chats.length, createTodayChat]);

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-1 flex-col">
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar chats={chats} />

          <main className="flex flex-1 flex-col gap-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
