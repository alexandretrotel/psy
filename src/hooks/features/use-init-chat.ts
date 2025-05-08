import { getOrCreateTodayChat, clearChat } from "@/lib/chat";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/stores/chat.store";

export function useInitChat() {
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

  return { clear };
}
