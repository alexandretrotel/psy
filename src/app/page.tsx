"use client";

import { ChatView } from "@/components/chat-view";
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
    const chat = await getOrCreateTodayChat();
    setSelectedChatId(chat.id);
    setCurrentChat(chat);
  }, [setCurrentChat, setSelectedChatId]);

  useEffect(() => {
    if (chats.length === 0) {
      initChat();
    }
  }, [chats.length, initChat]);

  const clear = async () => {
    try {
      if (!currentChat?.id) {
        toast.error("No chat selected");
        return;
      }

      await clearChat(currentChat?.id);
      await fetchChats();
      await initChat();

      toast.success("Chat cleared");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="transition-width relative h-full w-full flex-1">
      <header className="bg-background sticky top-0 z-50 flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        <Button variant="outline" size="sm" onClick={clear}>
          Clear Chat
        </Button>
      </header>

      <div className="flex-1 p-4">
        <ChatView chat={currentChat} />
      </div>
    </div>
  );
}
