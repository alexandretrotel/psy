"use client";

import { ChatView } from "@/components/chat/chat-view";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChats } from "@/hooks/use-chats";
import { clearChat, getOrCreateTodayChat } from "@/lib/chat";
import { useChatStore } from "@/stores/chat.store";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const { chats, fetchChats, currentChat, setCurrentChat } = useChats();
  const { selectedChatId, setSelectedChatId } = useChatStore();

  useEffect(() => {
    const chat = chats.find((chat) => chat.id === selectedChatId);
    if (chat) {
      setCurrentChat(chat);
    }
  }, [selectedChatId, chats, setCurrentChat]);

  const initChat = useCallback(async () => {
    try {
      const chat = await getOrCreateTodayChat();
      setSelectedChatId(chat.id);
      setCurrentChat(chat);
    } catch {
      toast.error("Failed to initialize chat.");
    }
  }, [setCurrentChat, setSelectedChatId]);

  useEffect(() => {
    if (chats.length === 0) {
      initChat();
    }
  }, [chats.length, initChat]);

  const clear = async () => {
    if (!currentChat?.id) {
      return toast.error("No chat selected");
    }

    try {
      await clearChat(currentChat.id);
      await fetchChats();
      await initChat();
      toast.success("Chat cleared");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="transition-width relative h-screen min-h-screen w-full">
      <header className="bg-background sticky top-0 z-50 flex h-16 items-center justify-between border-b p-4">
        <SidebarTrigger />
        <Button variant="outline" size="sm" onClick={clear}>
          Clear Chat
        </Button>
      </header>

      <div className="p-4" style={{ height: "calc(100vh - 64px)" }}>
        <ChatView chat={currentChat} />
      </div>
    </div>
  );
}
