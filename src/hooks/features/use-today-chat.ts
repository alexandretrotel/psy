import { getOrCreateTodayChat } from "@/lib/chat";
import { useChatStore } from "@/stores/chat.store";
import { useCallback, useEffect } from "react";
import { useChats } from "@/hooks/use-chats";
import { Chat } from "@/lib/db";

export function useTodayChat(chats: Chat[]) {
  const { setSelectedChatId } = useChatStore();
  const { setChats } = useChats();

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
}
